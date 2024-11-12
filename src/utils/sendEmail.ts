import axios from 'axios';
import { BadRequestException } from '@nestjs/common';

/**
 * Sends an email using the SendLayer API
 * @param {Object} params - The email parameters
 * @param {string} params.to - Recipient email address
 * @param {string} params.subject - Email subject line
 * @param {string} params.htmlContent - HTML content of the email
 * @throws {BadRequestException} When the API request fails
 * @returns {Promise<void>}
 */
export async function sendEmailApi({ to, subject, htmlContent }) {
  const apiURL = 'https://console.sendlayer.com/api/v1/email';
  
  const data = {
    From: {
      name: 'Trades Trek',
      email: 'hello@tradestrek.com',
    },
    To: [
      {
        email: to,
      },
    ],
    Subject: subject,
    ContentType: 'HTML',
    HTMLContent: htmlContent,
    PlainContent: htmlContent,
    Headers: {
      'X-Mailer': 'SendLayer API',
    },
  };

  try {
    await axios.post(apiURL, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer 118A4851-13623754-4782FEE6-ABC5B70A`,
      },
    });
  } catch (error) {
    throw new BadRequestException(error);
  }
}