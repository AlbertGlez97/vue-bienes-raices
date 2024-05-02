export const validationSchema = {
    titulo (value) {
      if (value?.length >= 6 ) return true
      return 'El titulo de la propiedad es obligatorio o muy corto'
    },
    precio (value) {
      /*
          ^ - Representa el inicio de la cadena.
          [0-9]+ - Representa cualquier número del 0 al 9. El + indica que debe haber al menos un dígito, pero puede haber más.
          $ - Representa el final de la cadena.
      */
      if (/^[0-9]+$/.test(value)) return true
      return 'El Precio solo deben ser números'
    },
    habitaciones (value) {
      if (value) return true
      return 'Selecciona una Cantidad'
    },
    wc (value) {
      if (value) return true
      return 'Selecciona una Cantidad'
    },
    estacionamiento (value) {
      if (value) return true
      return 'Selecciona una Cantidad'
    },
    descripcion (value) {
      if (value) return true
      return 'Agrega una Descripción'
    },
    pais (value) {
      if (value) return true
      return 'Selecciona un Pais'
    },
    estado (value) {
      if (value) return true
      return 'Selecciona un Estado'
    },
    ciudad (value) {
      if (value) return true
      return 'Selecciona una Ciudad'
    },
    calle (value) {
      if (value) return true
      return 'Agrega una calle'
    },
    codigoPostal (value) {
      if (value) return true
      return 'Agrega un Codigo Postal'
    },
    colonia (value) {
      if (value) return true
      return 'Agrega una Colonia'
    }
} 
  
//Se puso a parte porque no siempre va a hacer obligatorio colocar una imagen
export const imageSchema = {
  imagen (value) {
      if (value) return true
      return 'La Imagen es Obligatoria'
  },
}