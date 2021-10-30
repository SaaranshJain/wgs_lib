import pymysql
pymysql.install_as_MySQLdb()

from fastapi import FastAPI
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

engine = create_engine("mariadb://root:@localhost/wgs_lib", echo=True)
session: Session = sessionmaker(bind=engine)()

app = FastAPI()
Base = declarative_base()


class User(Base):
    __tablename__ = 'users'
    id = Column(String(36), primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(320), nullable=False, unique=True)
    password = Column(LargeBinary(), nullable=False)
    booksuploaded = relationship('Book')


class Book(Base):
    __tablename__ = 'books'
    id = Column(String(36), primary_key=True)
    title = Column(String(100), nullable=False)
    author = Column(String(100), nullable=False)
    cover = Column(Text())
    synopsis = Column(Text())
    uploadedby = Column(String(36), ForeignKey('users.id'))


class RegisterUser(BaseModel):
    name: str
    email: str
    password: str


@app.post("/register/")
async def register(user: RegisterUser):
    pwd = bcrypt.hashpw(user.password.encode('utf8'), bcrypt.gensalt(15))

    new_user = User(id=str(uuid()), name=user.name,
                    email=user.email, password=pwd)

    session.add(new_user)
    session.commit()

    return new_user


class LoginUser(BaseModel):
    email: str
    password: str


@app.post("/login/")
async def login(user: LoginUser):
    res: User = session.execute(select(User).where(
        User.email == user.email)).scalars().all()[0]

    if bcrypt.checkpw(user.password.encode('utf8'), res.password):
        return {"Pog": "kek"}

meta: MetaData = Base.metadata
meta.create_all(engine)
