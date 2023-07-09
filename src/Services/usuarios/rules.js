export const  validarCorreoContrasena = (correo, contraseña) =>{
    // Validar el correo electrónico
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        console.log("El correo electrónico no es válido.");
        return false;
    }
    
    // Validar la contraseña
    if (contraseña.length < 8) {
      console.log("La contraseña debe tener al menos 8 caracteres.");
      return false;
    }
    
    if (!/[a-z]/.test(contraseña)) {
        console.log("La contraseña debe contener al menos una letra minúscula.");
      return false;
    }
    
    if (!/[A-Z]/.test(contraseña)) {
        console.log("La contraseña debe contener al menos una letra MAYUSCULAS.");
      return false;
    }
    
    if (!/[0-9]/.test(contraseña)) {
      console.log("La contraseña debe contener al menos un dígito.");
      return false;
    }
    return  true;
  }
  

  