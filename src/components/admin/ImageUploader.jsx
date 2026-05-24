import { useState, useRef } from 'react';
import { api } from '../../api';
import { useLang } from '../../context/LangContext';

export default function ImageUploader({ value, onChange, label }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);
  const { t } = useLang();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.uploadImage(file);
      onChange(url);
    } catch (err) {
      alert(t('upload_error') + ': ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-uploader">
      {label && <label className="admin-label">{label}</label>}
      <div className="admin-uploader-area" onClick={() => inputRef.current?.click()}>
        {value ? (
          <img src={value} alt="" className="admin-uploader-preview" />
        ) : (
          <div className="admin-uploader-empty">
            <i className="ti ti-photo-plus"></i>
            <span>{uploading ? t('upload_uploading') : t('upload_click')}</span>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
      </div>
      {value && (
        <button className="admin-btn-sm admin-btn-danger" onClick={() => onChange('')} type="button">
          <i className="ti ti-trash"></i> {t('delete')}
        </button>
      )}
    </div>
  );
}
