import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFromEmail = process.env.RESEND_FROM_EMAIL || 'Prode Executive <onboarding@resend.dev>';

  if (!resendApiKey) {
    return NextResponse.json(
      { error: 'El servicio de correo no está configurado (falta RESEND_API_KEY)' },
      { status: 500 }
    );
  }

  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Por favor ingresá un correo electrónico válido.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Buscar el usuario por email
    const { data: user, error } = await supabase
      .from('fixture_usuarios')
      .select('dni, nombre_apellido, email')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (error) {
      console.error('Error al buscar usuario en Supabase:', error);
      return NextResponse.json({ error: 'Error al consultar la base de datos' }, { status: 500 });
    }

    // Por seguridad, si no existe el usuario, de todas formas retornamos éxito pero con un mensaje
    // sutil, o una indicación amigable. Para este caso del Prode privado, seremos directos pero seguros.
    if (!user) {
      return NextResponse.json({ 
        message: 'Si el correo electrónico ingresado está registrado, recibirás un mensaje con tus datos de acceso en los próximos minutos.' 
      });
    }

    // El DNI actúa como clave/contraseña
    const dniRecovery = user.dni;
    const nombreUsuario = user.nombre_apellido;

    // Construir un correo HTML sumamente elegante e interactivo con la marca "Remises Bruno"
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Recuperación de Clave - PRODE EXECUTIVE</title>
          <style>
            body {
              font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              background-color: #050508;
              color: #ffffff;
              margin: 0;
              padding: 0;
              -webkit-font-smoothing: antialiased;
            }
            .wrapper {
              width: 100%;
              background-color: #050508;
              padding: 40px 0;
            }
            .container {
              max-width: 500px;
              margin: 0 auto;
              background: #0c0d14;
              border: 1px solid rgba(212, 175, 55, 0.2);
              border-radius: 24px;
              overflow: hidden;
              box-shadow: 0 15px 50px rgba(0, 0, 0, 0.8);
            }
            .header {
              background: linear-gradient(180deg, #121420 0%, #0c0d14 100%);
              padding: 40px 20px;
              text-align: center;
              border-bottom: 1px solid rgba(212, 175, 55, 0.1);
            }
            .logo-placeholder {
              width: 70px;
              height: 70px;
              border-radius: 50%;
              border: 2px solid #d4af37;
              margin: 0 auto 15px auto;
              box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
              background-color: #1a1a1a;
              line-height: 70px;
              font-size: 24px;
              font-weight: bold;
              color: #d4af37;
            }
            .title {
              font-size: 22px;
              font-weight: 800;
              letter-spacing: 1px;
              color: #ffffff;
              margin: 0;
              text-transform: uppercase;
            }
            .subtitle {
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 2px;
              color: #d4af37;
              margin: 5px 0 0 0;
              text-transform: uppercase;
            }
            .content {
              padding: 40px 30px;
              text-align: center;
            }
            .greeting {
              font-size: 16px;
              color: #ffffff;
              margin-bottom: 20px;
              font-weight: 500;
            }
            .instruction {
              font-size: 14px;
              color: #9aa2b1;
              line-height: 1.6;
              margin-bottom: 30px;
            }
            .credentials-box {
              background: rgba(212, 175, 55, 0.05);
              border: 1px dashed rgba(212, 175, 55, 0.3);
              border-radius: 16px;
              padding: 24px;
              margin: 25px 0;
              text-align: center;
            }
            .credential-label {
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 2px;
              color: #9aa2b1;
              margin-bottom: 5px;
            }
            .credential-value {
              font-size: 24px;
              font-weight: 800;
              color: #d4af37;
              letter-spacing: 1px;
              margin: 0 0 15px 0;
            }
            .credential-value.small {
              font-size: 15px;
              color: #ffffff;
              letter-spacing: 0.5px;
              margin: 0;
            }
            .btn {
              display: inline-block;
              background: linear-gradient(135deg, #d4af37 0%, #b28d28 100%);
              color: #050508 !important;
              text-decoration: none;
              font-weight: 700;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 1.5px;
              padding: 14px 35px;
              border-radius: 50px;
              box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
              margin-top: 15px;
              transition: all 0.3s ease;
            }
            .footer {
              padding: 30px 20px;
              background: #050508;
              text-align: center;
              border-top: 1px solid rgba(212, 175, 55, 0.05);
            }
            .footer-text {
              font-size: 11px;
              color: #646c7c;
              line-height: 1.5;
              margin: 0;
            }
            .footer-link {
              color: #d4af37;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <!-- Header -->
              <div class="header">
                <div class="logo-placeholder">RB</div>
                <h1 class="title">PRODE EXECUTIVE</h1>
                <p class="subtitle">Remises Bruno</p>
              </div>
              
              <!-- Content -->
              <div class="content">
                <p class="greeting">¡Hola, ${nombreUsuario}!</p>
                <p class="instruction">Recibimos una solicitud para recuperar tus datos de acceso para el Prode Executive de Remises Bruno. A continuación encontrarás tus credenciales de ingreso:</p>
                
                <div class="credentials-box">
                  <div class="credential-label">Tu Correo Electrónico</div>
                  <div class="credential-value small" style="margin-bottom: 20px;">${cleanEmail}</div>
                  
                  <div class="credential-label">Tu Contraseña (D.N.I.)</div>
                  <div class="credential-value">${dniRecovery}</div>
                </div>
                
                <p class="instruction" style="margin-top: 10px;">Recordá que podés iniciar sesión utilizando tanto tu correo electrónico como tu número de D.N.I. sin puntos.</p>
                
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://brunoremisesweb-mdnb.vercel.app/'}" class="btn">Ingresar al Prode</a>
              </div>
              
              <!-- Footer -->
              <div class="footer">
                <p class="footer-text">Este es un correo automático enviado por Remises Bruno.<br>Si no solicitaste esta recuperación, por favor desestimá este mensaje.</p>
                <p class="footer-text" style="margin-top: 10px;">&copy; 2026 <a href="https://remisesbruno.com" class="footer-link">Remises Bruno</a>. Todos los derechos reservados.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Enviar el correo usando la API REST de Resend directamente
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: resendFromEmail,
        to: [cleanEmail],
        subject: '🔑 Recuperación de Clave - Prode Remises Bruno',
        html: emailHtml,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json();
      console.error('Error de API Resend:', errorData);
      return NextResponse.json({ error: 'Hubo un error al enviar el correo a través de Resend.' }, { status: 502 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Si el correo electrónico ingresado está registrado, recibirás un mensaje con tus datos de acceso en los próximos minutos.' 
    });
  } catch (err: any) {
    console.error('Excepción en API recuperar-clave:', err);
    return NextResponse.json({ error: 'Excepción interna en el servidor' }, { status: 500 });
  }
}
