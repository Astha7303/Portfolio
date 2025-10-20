import React, {useRef, useState} from 'react'
import emailjs from '@emailjs/browser'

export default function Contact(){
  const form = useRef()
  const [status, setStatus] = useState(null)

  const sendEmail = (e) => {
    e.preventDefault()
    const SERVICE_ID = 'YOUR_SERVICE_ID'
    const TEMPLATE_ID = 'YOUR_TEMPLATE_ID'
    const USER_ID = 'YOUR_PUBLIC_KEY'

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, USER_ID)
      .then((result) => {
          setStatus('Message sent — thank you!')
          e.target.reset()
      }, (error) => {
          setStatus('Failed to send message. Configure EmailJS and check console.')
          console.error(error.text)
      })
  }

  return (
    <section id="contact" className="section">
      <div className="container">
        <h2 className="section-title">Contact</h2>
        <div className="row">
          {/* <div className="col-md-6">
            <form ref={form} onSubmit={sendEmail} className="contact-card">
              <input name="from_name" className="form-control mb-3" placeholder="Your name" required />
              <input name="reply_to" className="form-control mb-3" type="email" placeholder="Your email" required />
              <textarea name="message" className="form-control mb-3" rows="5" placeholder="Message" required></textarea>
              <button className="btn btn-primary w-100">Send message</button>
              {status && <div className="mt-3 text-success">{status}</div>}
            </form>
          </div> */}
          <div className="col-md-6">
            <div className="contact-info">
              <p><strong>Email:</strong> asthajethava@gmail.com</p>
              <p><strong>Phone:</strong> +91 6359391396</p>
              <p><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/astha-jethava" target="_blank" rel="noreferrer">linkedin.com/in/astha-jethava</a></p>
              <p><strong>GitHub:</strong> <a href="https://github.com/Astha7303" target="_blank" rel="noreferrer">Astha7303</a></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
