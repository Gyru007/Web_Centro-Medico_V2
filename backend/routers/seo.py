from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter()

BASE_URL = "https://www.realmendez.com"


@router.get("/sitemap.xml", response_class=Response)
def generar_sitemap(db: Session = Depends(get_db)):
    urls = [
        f"<url><loc>{BASE_URL}/</loc><priority>1.0</priority></url>",
        f"<url><loc>{BASE_URL}/servicios</loc><priority>0.9</priority></url>",
        f"<url><loc>{BASE_URL}/medicos</loc><priority>0.9</priority></url>",
        f"<url><loc>{BASE_URL}/blog</loc><priority>0.8</priority></url>",
        f"<url><loc>{BASE_URL}/contacto</loc><priority>0.7</priority></url>",
    ]
    for e in db.query(models.Especialidad).filter(models.Especialidad.activo == True).all():
        urls.append(
            f"<url><loc>{BASE_URL}/servicios/{e.slug}</loc><priority>0.85</priority></url>"
        )
    for m in db.query(models.Medico).filter(models.Medico.activo == True).all():
        urls.append(
            f"<url><loc>{BASE_URL}/medicos/{m.slug}</loc><priority>0.85</priority></url>"
        )
    for p in db.query(models.PostBlog).filter(models.PostBlog.estado == "publicado").all():
        urls.append(
            f"<url><loc>{BASE_URL}/blog/{p.slug}</loc><priority>0.75</priority></url>"
        )
    xml = '<?xml version="1.0" encoding="UTF-8"?>'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    xml += "".join(urls) + "</urlset>"
    return Response(content=xml, media_type="application/xml")


@router.get("/schema/medico/{medico_id}")
def get_schema_medico(medico_id: int, db: Session = Depends(get_db)):
    m = db.query(models.Medico).filter(models.Medico.id == medico_id).first()
    if not m:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Médico no encontrado")
    return {
        "@context": "https://schema.org",
        "@type": "Physician",
        "name": m.nombre,
        "description": m.biografia,
        "image": m.foto_url,
        "medicalSpecialty": m.especialidad.nombre if m.especialidad else None,
        "worksFor": {
            "@type": "MedicalOrganization",
            "name": "Centro Médico Real Méndez",
            "url": BASE_URL,
        },
    }


@router.get("/schema/clinica")
def get_schema_clinica():
    return {
        "@context": "https://schema.org",
        "@type": "MedicalOrganization",
        "name": "Centro Médico Real Méndez",
        "url": BASE_URL,
        "logo": f"{BASE_URL}/logo.png",
        "description": "Centro médico especializado en salud integral",
        "medicalSpecialty": [
            "Cardiología", "Pediatría", "Neurología",
            "Ginecología", "Traumatología", "Dermatología"
        ],
    }
