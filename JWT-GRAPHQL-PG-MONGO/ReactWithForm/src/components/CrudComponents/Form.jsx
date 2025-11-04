import React from 'react';

export const PersonForm = ({ formData = {}, handleChange, errors = {} }) => {
  // Dni handler: elimina todo lo que no sea dígito y limita a 10
  const handleDniChange = (e) => {
    let value = e.target.value || '';
    value = value.replace(/\D/g, '').slice(0, 10);
    // Llamamos al handleChange del padre con un evento sintético compatible
    handleChange({ target: { name: 'dni', value } });
  };

  return (
    <div>
      <div className="form-group">
        <label htmlFor="dni">DNI</label>
        <input
          id="dni"
          name="dni"
          inputMode="numeric"
          pattern="\d*"
          maxLength={10}
          value={formData.dni || ''}
          onChange={handleDniChange}
        />
        {errors.dni && <div className="error-message">{errors.dni}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="nombres">Nombres</label>
        <input id="nombres" name="nombres" value={formData.nombres || ''} onChange={handleChange} />
        {errors.nombres && <div className="error-message">{errors.nombres}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="apellidos">Apellidos</label>
        <input id="apellidos" name="apellidos" value={formData.apellidos || ''} onChange={handleChange} />
        {errors.apellidos && <div className="error-message">{errors.apellidos}</div>}
      </div>
    </div>
  );
};

export default PersonForm;
