import emailjs from '@emailjs/browser';
import { supabase } from '../supabaseClient';
import bcrypt from 'bcryptjs';

// Configuración de EmailJS
const EMAILJS_SERVICE_ID = 'service_gglt6uh';
const EMAILJS_TEMPLATE_ID = 'template_pgzf8bt';
const EMAILJS_PUBLIC_KEY = 'K_TVmmRXDfFPJbpig';

// Inicializar EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

// Generar token de reset seguro
const generateResetToken = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) + 
         Date.now().toString(36);
};

// Función para enviar email de reset
export const sendPasswordResetEmail = async (email) => {
  try {
    // Verificar si el email existe
    const { data: user, error: userError } = await supabase
      .from('usuarios')
      .select('id, nombre')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return { 
        success: true, 
        message: 'Si el email existe, recibirás un enlace de restablecimiento.' 
      };
    }

    // Generar token de reset
    const resetToken = generateResetToken();
    // En la función sendPasswordResetEmail, cambiar esta línea:
    // En sendPasswordResetEmail, cambiar:
    const tokenExpiry = new Date(Date.now() + 14400000); // 2 horas en lugar de 1
    
    // Guardar token en la base de datos
    const { error: updateError } = await supabase
      .from('usuarios')
      .update({
        reset_token: resetToken,
        reset_token_expiry: tokenExpiry.toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      throw new Error('Error al generar token de reset');
    }

    // Crear enlace de reset
    const resetLink = `${window.location.origin}/reset-password?token=${resetToken}`;

    // Parámetros que coinciden con tu plantilla
    const templateParams = {
      email: email,              // Coincide con {{email}} en tu plantilla
      to_name: user.nombre,      // Coincide con {{to_name}} en tu plantilla
      reset_link: resetLink      // Para el botón en tu plantilla
    };

    console.log('Enviando email con parámetros:', templateParams);

    // Enviar email
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    return {
      success: true,
      message: 'Si el email existe, recibirás un enlace de restablecimiento.'
    };

  } catch (error) {
    console.error('Error al enviar email:', error);
    return {
      success: false,
      message: 'Error al procesar la solicitud. Inténtalo más tarde.'
    };
  }
};

// Función para validar y resetear contraseña
export const resetPasswordWithToken = async (token, newPassword) => {
  try {
    // Buscar usuario por token válido
    const { data: user, error: userError } = await supabase
      .from('usuarios')
      .select('id, reset_token_expiry')
      .eq('reset_token', token)
      .single();

    if (userError || !user) {
      return {
        success: false,
        message: 'Token inválido o expirado.'
      };
    }

    // Verificar si el token no ha expirado - usar UTC para ambas fechas
    const now = new Date();
    const expiry = new Date(user.reset_token_expiry);
    
    // Agregar 1 hora de margen para compensar diferencias de zona horaria
    const adjustedExpiry = new Date(expiry.getTime() + 3600000); // +1 hora
    
    if (now > adjustedExpiry) {
      return {
        success: false,
        message: 'El enlace ha expirado. Solicita uno nuevo.'
      };
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña y limpiar token
    const { error: updateError } = await supabase
      .from('usuarios')
      .update({
        password: hashedPassword,
        reset_token: null,
        reset_token_expiry: null
      })
      .eq('id', user.id);

    if (updateError) {
      throw new Error('Error al actualizar contraseña');
    }

    return {
      success: true,
      message: 'Contraseña actualizada exitosamente.'
    };

  } catch (error) {
    console.error('Error al resetear contraseña:', error);
    return {
      success: false,
      message: 'Error al procesar la solicitud.'
    };
  }
};
