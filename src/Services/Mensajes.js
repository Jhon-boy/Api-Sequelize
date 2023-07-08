import nodemailer from 'nodemailer'
import fs from 'fs';
import PDFDocument from 'pdfkit';
import moment from 'moment';


export const enviarMail = (correo, nuevaContrasena) => {
    const config = {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'jhoncuvi12@gmail.com',
            pass: 'rnnmlcemreuekfhl'
        }
    };

    const mensaje = {
        from: 'jhoncuvi12@gmail.com',
        to: correo,
        subject: 'Recuperar Contraseña',
        html: `      <h2 style="margin-bottom: 20px;">Haz solicitado restablecer tu contraseña</h2>
        <p>Por favor, actualiza inmediatamente tu Contraseña:</p>
           <p>Tu nueva contraseña es: <strong>${nuevaContrasena}</strong></p>`
    };

    const transport = nodemailer.createTransport(config);

    transport.sendMail(mensaje, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Email enviado:', info.response);
        }
    });
};
export const enviarFactura = (correo, marca, modelo, total, fechaFactura) => {
    const fechaPago = moment().format('YYYY-MM-DD');
    const numeroFactura = '0087xxxxx7';

    const config = {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'jhoncuvi12@gmail.com',
            pass: 'rnnmlcemreuekfhl'
        }
    };

    const pdf = new PDFDocument();
    const fileName = `facturaRentaCAR.pdf`;
    const pdfStream = fs.createWriteStream(fileName);

    pdf.pipe(pdfStream);
    pdf.fontSize(12).text('Factura de Alquiler', { align: 'center' });
    pdf.fontSize(10).text(`Fecha de Factura: ${fechaFactura}`);
    pdf.fontSize(10).text(`Fecha de Pago: ${fechaPago}`);
    pdf.fontSize(10).text(`Número de Factura: ${numeroFactura}`);
    pdf.fontSize(10).text(`Auto alquilado: ${marca} - ${modelo}`);
    pdf.fontSize(10).text(`Precio total: ${total}`);
    pdf.end();

    const mensaje = {
        from: 'jhoncuvi12@gmail.com',
        to: 'jhoncuvi12@gmail.com',
        subject: `Factura Nº ${numeroFactura}`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ccc;">
                <h2 style="margin-bottom: 20px;">Factura de Alquiler</h2>
                <p><strong>Fecha de Factura:</strong> ${fechaPago}</p>
                <p><strong>Número de Factura:</strong> ${numeroFactura}</p>
                <p><strong>Auto alquilado:</strong> ${marca} - ${modelo}</p>
                <p><strong>Precio total:</strong> ${total}</p>
                <p><strong>Correo enviado a:</strong> ${correo}</p>
                <p style="margin-top: 20px;">Gracias por su preferencia.</p>
            </div>
        `,
        attachments: [
            {
                filename: fileName,
                content: fs.createReadStream(fileName)
            }
        ]
    };

    const transport = nodemailer.createTransport(config);

    transport.sendMail(mensaje, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Email enviado:', info.response);
            // Eliminar el archivo PDF después de enviarlo como adjunto
            fs.unlinkSync(fileName);
        }
    });
};

export const nuevoUsuario = (nuevoUsuario) => {
    const config = {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'jhoncuvi12@gmail.com',
            pass: 'rnnmlcemreuekfhl'
        }
    };

    const mensaje = {
        from: 'jhoncuvi12@gmail.com',
        to: 'jhoncuvi12@gmail.com',
        subject: 'Aviso de Usuario Creado',
        html: `<p>Se ha creado un nuevo usuario:</p>
             <p>Correo electrónico: <strong>${nuevoUsuario}</strong></p>
             <p>Revisa su perfil inmediatamente!</p>`
    };

    const transport = nodemailer.createTransport(config);

    transport.sendMail(mensaje, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Email enviado:', info.response);
        }
    });
};