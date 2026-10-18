const sendEmail = async () => {
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate email sending delay
    console.log('Email sent successfully');
}

export default sendEmail;