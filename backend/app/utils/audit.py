from sqlalchemy.orm import Session
from app.models.audit_log import AuditLog

def log_action(db: Session, user_id: int, action: str, entity: str, entity_id: int, previous_value: str = None, new_value: str = None, ip_address: str = None):
    audit_entry = AuditLog(
        user_id=user_id,
        action=action,
        entity=entity,
        entity_id=entity_id,
        previous_value=previous_value,
        new_value=new_value,
        ip_address=ip_address
    )
    db.add(audit_entry)
    db.commit()
