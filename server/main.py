from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String

engine = create_engine("mariadb://root:@localhost/wgs_lib", echo=True)

meta = MetaData()



meta.create_all(engine)
