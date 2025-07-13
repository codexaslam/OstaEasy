import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle,
  Clock,
  Coffee,
  Globe,
  Headphones,
  Heart,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  Phone,
  Send,
  Shield,
  Sparkles,
  Star,
  Timer,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import "./Contact.scss";

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      title: t("contact.messageSent"),
      text: "Thank you for reaching out. Our team will get back to you within 24 hours.",
      icon: "success",
      confirmButtonText: "Perfect!",
      confirmButtonColor: "#2563eb",
      background: "#ffffff",
      customClass: {
        popup: "contact-success-popup",
      },
    });

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="contact-page">
      {/* Hero Section - Redesigned */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-text">
              <Badge className="hero-badge" variant="secondary">
                <MessageCircle className="badge-icon" />
                {t("contact.getInTouch")}
              </Badge>

              <h1 className="hero-title">{t("contact.contactUs")}</h1>

              <p className="hero-description">
                {t("contact.contactDescription")}
              </p>

              <div className="hero-features">
                <div className="feature-item">
                  <div className="feature-icon">
                    <Timer />
                  </div>
                  <div className="feature-text">
                    <h4>Quick Response</h4>
                    <p>24hr response time</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <Headphones />
                  </div>
                  <div className="feature-text">
                    <h4>Expert Support</h4>
                    <p>Dedicated specialists</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <Globe />
                  </div>
                  <div className="feature-text">
                    <h4>Global Reach</h4>
                    <p>Worldwide presence</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="floating-elements">
                <div className="floating-card card-1">
                  <MessageSquare />
                </div>
                <div className="floating-card card-2">
                  <Heart />
                </div>
                <div className="floating-card card-3">
                  <Star />
                </div>
                <div className="floating-card card-4">
                  <Coffee />
                </div>
                <div className="floating-card card-5">
                  <Zap />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="main-contact-section">
        <div className="contact-container">
          <div className="contact-grid">
            {/* Contact Form Column */}
            <div className="contact-form-column">
              <Badge className="section-badge" variant="secondary">
                <Send className="badge-icon" />
                Send Message
              </Badge>

              <h2 className="section-title">Get In Touch</h2>
              <p className="section-description">
                Ready to take the next step? Fill out the form below and we'll
                get back to you with personalized solutions.
              </p>

              <Card className="contact-form-card">
                <CardContent className="form-content">
                  <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-grid">
                      <div className="form-group">
                        <Label htmlFor="firstName" className="form-label">
                          First Name *
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="John"
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <Label htmlFor="lastName" className="form-label">
                          Last Name *
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Doe"
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <Label htmlFor="email" className="form-label">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <Label htmlFor="phone" className="form-label">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 123-4567"
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <Label htmlFor="subject" className="form-label">
                        Subject *
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group message-group">
                      <Label htmlFor="message" className="form-label">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your project, questions, or how we can help..."
                        className="form-textarea"
                        rows={6}
                      />
                    </div>

                    <div className="form-actions">
                      <Button type="submit" className="submit-btn">
                        <Send className="btn-icon" />
                        Send Message
                        <ArrowRight className="btn-arrow" />
                      </Button>

                      <p className="form-note">
                        We'll respond within 24 hours. Your information is
                        secure and confidential.
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information Column */}
            <div className="contact-info-column">
              <Badge className="section-badge" variant="secondary">
                <Building2 className="badge-icon" />
                Contact Info
              </Badge>

              <h2 className="section-title">Multiple Ways to Connect</h2>
              <p className="section-description">
                Choose the communication method that works best for you. We're
                available across multiple channels to assist you.
              </p>

              <div className="contact-methods">
                <Card className="contact-method-card">
                  <CardContent className="method-content">
                    <div className="method-icon">
                      <Phone />
                    </div>
                    <div className="method-info">
                      <h4 className="method-title">Phone Support</h4>
                      <p className="method-detail">+1 (555) 123-4567</p>
                      <p className="method-note">Mon-Fri 9AM-6PM EST</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="contact-method-card">
                  <CardContent className="method-content">
                    <div className="method-icon">
                      <Mail />
                    </div>
                    <div className="method-info">
                      <h4 className="method-title">Email Support</h4>
                      <p className="method-detail">hello@ostaeasy.com</p>
                      <p className="method-note">24/7 response guarantee</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="contact-method-card">
                  <CardContent className="method-content">
                    <div className="method-icon">
                      <MapPin />
                    </div>
                    <div className="method-info">
                      <h4 className="method-title">Visit Our Office</h4>
                      <p className="method-detail">
                        123 Innovation Drive
                        <br />
                        Tech Valley, CA 94043
                      </p>
                      <p className="method-note">By appointment only</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="contact-method-card">
                  <CardContent className="method-content">
                    <div className="method-icon">
                      <MessageCircle />
                    </div>
                    <div className="method-info">
                      <h4 className="method-title">Live Chat</h4>
                      <p className="method-detail">Available on our website</p>
                      <p className="method-note">Instant responses</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="business-hours">
                <h3 className="hours-title">
                  <Clock className="hours-icon" />
                  Business Hours
                </h3>
                <div className="hours-grid">
                  <div className="hour-item">
                    <span className="day">Monday - Friday</span>
                    <span className="time">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="hour-item">
                    <span className="day">Saturday</span>
                    <span className="time">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="hour-item">
                    <span className="day">Sunday</span>
                    <span className="time">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="faq-container">
          <div className="faq-header">
            <Badge className="section-badge" variant="secondary">
              <MessageSquare className="badge-icon" />
              Frequently Asked
            </Badge>

            <h2 className="section-title">Questions & Answers</h2>
            <p className="section-description">
              Find quick answers to common questions. Can't find what you're
              looking for? Don't hesitate to reach out directly.
            </p>
          </div>

          <div className="faq-content">
            <Accordion type="single" collapsible className="faq-accordion">
              <AccordionItem value="item-1" className="faq-item">
                <AccordionTrigger className="faq-trigger">
                  <span className="trigger-icon">
                    <CheckCircle />
                  </span>
                  What is your typical response time for inquiries?
                </AccordionTrigger>
                <AccordionContent className="faq-content-text">
                  We pride ourselves on quick responses. For email inquiries,
                  you can expect a response within 24 hours during business
                  days. For urgent matters, our live chat and phone support
                  provide immediate assistance during business hours.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="faq-item">
                <AccordionTrigger className="faq-trigger">
                  <span className="trigger-icon">
                    <Shield />
                  </span>
                  How do you handle customer data and privacy?
                </AccordionTrigger>
                <AccordionContent className="faq-content-text">
                  Your privacy is paramount to us. We follow strict data
                  protection protocols and comply with GDPR and other privacy
                  regulations. All information shared through our contact forms
                  is encrypted and stored securely, used only for the purpose of
                  responding to your inquiry.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="faq-item">
                <AccordionTrigger className="faq-trigger">
                  <span className="trigger-icon">
                    <Users />
                  </span>
                  Do you offer consultation services?
                </AccordionTrigger>
                <AccordionContent className="faq-content-text">
                  Absolutely! We offer free initial consultations to understand
                  your needs and discuss how we can help. These sessions can be
                  conducted via phone, video call, or in-person at our office.
                  Simply mention your interest in a consultation when you
                  contact us.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="faq-item">
                <AccordionTrigger className="faq-trigger">
                  <span className="trigger-icon">
                    <Award />
                  </span>
                  What makes your customer service different?
                </AccordionTrigger>
                <AccordionContent className="faq-content-text">
                  We believe in personalized, human-centered support. Every
                  inquiry is handled by experienced professionals who take the
                  time to understand your unique situation. We don't use
                  chatbots for complex issues and ensure you always have a
                  direct line to real experts.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="faq-item">
                <AccordionTrigger className="faq-trigger">
                  <span className="trigger-icon">
                    <Globe />
                  </span>
                  Do you provide support for international customers?
                </AccordionTrigger>
                <AccordionContent className="faq-content-text">
                  Yes, we serve customers worldwide! While our primary business
                  hours are EST, we have support staff in multiple time zones to
                  accommodate international clients. Email support is available
                  24/7, and we can schedule calls at convenient times for any
                  time zone.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="faq-item">
                <AccordionTrigger className="faq-trigger">
                  <span className="trigger-icon">
                    <Sparkles />
                  </span>
                  How can I stay updated with your latest offerings?
                </AccordionTrigger>
                <AccordionContent className="faq-content-text">
                  Join our newsletter for the latest updates, product
                  announcements, and exclusive offers. You can also follow us on
                  social media platforms for real-time updates and
                  behind-the-scenes content. We respect your inbox and only send
                  valuable, relevant information.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
