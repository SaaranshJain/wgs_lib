from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from pydantic import BaseModel

from sqlalchemy.engine import create_engine
from sqlalchemy.orm.session import Session
from sqlalchemy.sql.schema import MetaData, Column, ForeignKey
from sqlalchemy.sql.sqltypes import String, Text, LargeBinary
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy import select

from uuid import uuid4 as uuid
import bcrypt

engine = create_engine("mariadb://admin:@localhost/wgs_lib", echo=True)
session: Session = sessionmaker(bind=engine)()

app = FastAPI()
app.mount("/books", StaticFiles(directory="books"), name="books")
Base = declarative_base()


origins = [
    "http://localhost:8000",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Book(Base):
    __tablename__ = 'books'
    id = Column(String(36), primary_key=True)
    title = Column(String(100), nullable=False)
    file_loc = Column(String(256))
    cover = Column(String(256))


@app.post("/file/")
async def create_upload_file(file: UploadFile = File(...), title: str = Form(...), cover: str = Form(...)):
    loc = f"./books/{file.filename}"

    new_book = Book(id=uuid(), title=title, file_loc=f"http://localhost:8000/books/{file.filename}", cover=cover)
    session.add(new_book)
    session.commit()

    with open(loc, "wb") as f:
        f.write(await file.read())


@app.get("/")
async def home():
    data = {}
    for book in session.query(Book).all():
        data[book.title] = {'loc': book.file_loc, 'cover': book.cover}

    return data


meta: MetaData = Base.metadata
meta.create_all(engine)
