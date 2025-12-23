from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import date
from typing import List
from pydantic import BaseModel

from backend.database import SessionLocal, engine, Base
from backend.models import Application

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://job-application-tracker-403r6rvfx-ben-bouhdanas-projects.vercel.app",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class ApplicationCreate(BaseModel):
    company: str
    role: str
    status: str
    date_applied: date
    notes: str | None = None

class ApplicationResponse(ApplicationCreate):
    id: int

    class Config:
        orm_mode = True

@app.post("/applications", response_model=ApplicationResponse)
def create_application(app_data: ApplicationCreate, db: Session = Depends(get_db)):
    new_app = Application(**app_data.dict())
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    return new_app

@app.get("/applications", response_model=List[ApplicationResponse])
def get_applications(db: Session = Depends(get_db)):
    return db.query(Application).all()

@app.put("/applications/{app_id}", response_model=ApplicationResponse)
def update_application(
    app_id: int,
    app_data: ApplicationCreate,
    db: Session = Depends(get_db)
):
    application = db.query(Application).filter(Application.id == app_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    for key, value in app_data.dict().items():
        setattr(application, key, value)

    db.commit()
    db.refresh(application)
    return application

@app.delete("/applications/{app_id}")
def delete_application(app_id: int, db: Session = Depends(get_db)):
    application = db.query(Application).filter(Application.id == app_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    db.delete(application)
    db.commit()
    return {"message": "Application deleted"}
