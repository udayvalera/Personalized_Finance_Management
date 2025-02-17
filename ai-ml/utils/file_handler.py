import os
import shutil
from typing import Set

class FileHandler:
    ALLOWED_EXTENSIONS: Set[str] = {'png', 'jpg', 'jpeg', 'webp'}
    
    @staticmethod
    def allowed_file(filename: str) -> bool:
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in FileHandler.ALLOWED_EXTENSIONS
    
    @staticmethod
    def save_file(file, upload_folder: str) -> str:
        os.makedirs(upload_folder, exist_ok=True)
        file_path = os.path.join(upload_folder, file.filename)
        file.save(file_path)
        return file_path
    
    @staticmethod
    def cleanup_folder(folder_path: str) -> None:
        if os.path.exists(folder_path):
            shutil.rmtree(folder_path)