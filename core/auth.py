import functools
from flask import session, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from core.db import get_db

def hash_password(password: str) -> str:
    """Hash password using pbkdf2:sha256."""
    return generate_password_hash(password, method='pbkdf2:sha256')

def verify_password(password: str, hashed_password: str) -> bool:
    """Verify raw password against hash."""
    return check_password_hash(hashed_password, password)

def get_current_user():
    """Retrieve current logged in user from session."""
    user_id = session.get("user_id")
    if not user_id:
        return None
    
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, email, full_name, role, register_number, department FROM users WHERE id = ?", (user_id,))
        user = cursor.fetchone()
        return dict(user) if user else None

def login_required(view_func):
    """Decorator to enforce authenticated session."""
    @functools.wraps(view_func)
    def wrapped_view(*args, **kwargs):
        if not session.get("user_id"):
            return jsonify({"success": False, "error": "Authentication required. Please log in."}), 401
        return view_func(*args, **kwargs)
    return wrapped_view

def role_required(*allowed_roles):
    """Decorator to enforce role permissions (e.g. 'admin', 'faculty')."""
    def decorator(view_func):
        @functools.wraps(view_func)
        def wrapped_view(*args, **kwargs):
            role = session.get("role")
            if not role:
                return jsonify({"success": False, "error": "Authentication required."}), 401
            if role not in allowed_roles:
                return jsonify({"success": False, "error": f"Access denied. Requires role: {', '.join(allowed_roles)}"}), 403
            return view_func(*args, **kwargs)
        return wrapped_view
    return decorator
