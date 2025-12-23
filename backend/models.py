from sqlalchemy import Column, Integer, String, Date
from database import Base

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String, index=True)
    role = Column(String)
    status = Column(String)
    date_applied = Column(Date)
    notes = Column(String, nullable=True)
