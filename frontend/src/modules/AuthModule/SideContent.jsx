import React, { useState, useEffect } from 'react';
import logo from '@/style/images/logo.svg';
import {
  CustomerServiceFilled,
  ContainerFilled,
  CreditCardFilled,
  StarFilled,
  ThunderboltFilled,
} from '@ant-design/icons';

const dynamicPhrases = [
  'Customer & Client Management',
  'Professional Quotes & Invoices',
  'Real-Time Payment Tracking',
  'Live Financial Dashboard & KPIs',
  'Instant PDF Generation & Export',
];

export default function SideContent() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % dynamicPhrases.length);
        setFade(true);
      }, 350);
    }, 3200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="auth-hero-container">
      {/* Background Ambient Glowing Orbs */}
      <div className="ambient-orb orb-1" />
      <div className="ambient-orb orb-2" />
      <div className="ambient-orb orb-3" />

      <div className="auth-hero-content">
        {/* Top Logo */}
        <div className="auth-logo-wrapper">
          <img src={logo} alt="MyCRM Logo" className="auth-hero-logo" />
        </div>

        {/* Eye-catching badge */}
        <div className="auth-badge">
          <ThunderboltFilled className="auth-badge-icon" />
          <span>Smart Cloud CRM & Invoicing</span>
        </div>

        {/* Big Animated Headline */}
        <div className="auth-headline-wrapper">
          <h1 className="auth-main-title">
            Manage Clients & Invoices With
            <span className={`auth-dynamic-word ${fade ? 'fade-in' : 'fade-out'}`}>
              {dynamicPhrases[index]}
            </span>
          </h1>
          <p className="auth-subtitle">
            Streamline your customer relationships, create proforma quotes, issue itemized invoices, and track payments seamlessly in one unified CRM workspace.
          </p>
        </div>

        {/* Feature Cards Showcase based on actual modules */}
        <div className="auth-features-list">
          <div className="auth-feature-card">
            <div className="feature-icon-box icon-blue">
              <CustomerServiceFilled />
            </div>
            <div className="feature-text">
              <h4>Customer & Client Profiles</h4>
              <p>Organize client contacts, company details, history, and status.</p>
            </div>
          </div>

          <div className="auth-feature-card">
            <div className="feature-icon-box icon-purple">
              <ContainerFilled />
            </div>
            <div className="feature-text">
              <h4>Quotes & Invoicing with PDF</h4>
              <p>Build itemized quotes and invoices with instant PDF export & downloads.</p>
            </div>
          </div>

          <div className="auth-feature-card">
            <div className="feature-icon-box icon-green">
              <CreditCardFilled />
            </div>
            <div className="feature-text">
              <h4>Payment Tracking & Tax Rules</h4>
              <p>Log transactions across payment modes with automated tax calculations.</p>
            </div>
          </div>
        </div>

        {/* Bottom Trust Bar */}
        <div className="auth-trust-bar">
          <div className="stars-group">
            {[...Array(5)].map((_, i) => (
              <StarFilled key={i} className="star-icon" />
            ))}
          </div>
          <span className="trust-text">Unified CRM, Invoicing, and Payment Management</span>
        </div>
      </div>
    </div>
  );
}
