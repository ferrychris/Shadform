import emailjs from '@emailjs/browser';
import { FormData } from '../types/form';

export const sendFormDataByEmail = async (formData: FormData): Promise<boolean> => {
  try {
    const templateParams = {
      from_name: formData.name as string,
      from_email: formData.email as string,
      phone_number: formData.phone as string,
      address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
      position_type: formData.positionType as string,
      experience: formData.experience as string,
      availability: formData.availability as string,
      linkedin: formData.resume || 'Not provided',
      additional_info: formData.additionalInfo || 'None',
      to_name: 'AKG Consulting',
      message: `
        Position Applied For: ${formData.positionType}
        Experience: ${formData.experience}
        Availability: ${formData.availability}
        
        Contact Information:
        Phone: ${formData.phone}
        Address: ${formData.address}
        City: ${formData.city}
        State: ${formData.state}
        Zip: ${formData.zipCode}
        
        Additional Information:
        LinkedIn/Portfolio: ${formData.resume || 'Not provided'}
        Notes: ${formData.additionalInfo || 'None'}
      `
    };

    const response = await emailjs.send(
      "service_bmrfqqn",
      "template_zij5nm9",
      templateParams
    );

    return response.status === 200;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};