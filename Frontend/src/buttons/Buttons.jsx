import React from 'react';
import styled from 'styled-components';

const Button = ({ children, style, ...props }) => {
  // Check if this is an emergency CTA button (has custom style)
  const isEmergencyCTA = style && style.background;
  
  return (
    <StyledWrapper>
      <button 
        className={`button ${isEmergencyCTA ? 'emergency-cta' : ''}`} 
        style={style}
        {...props}
      >
        {children}
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .button {
    padding: 15px 25px;
    border: unset;
    border-radius: 15px;
    color: #212121;
    z-index: 1;
    background: #e8e8e8;
    position: relative;
    font-weight: 1000;
    font-size: 17px;
    -webkit-box-shadow: 4px 8px 19px -3px rgba(0,0,0,0.27);
    box-shadow: 4px 8px 19px -3px rgba(0,0,0,0.27);
    transition: all 250ms;
    overflow: hidden;
    cursor: pointer;
    border: none;
  }

  .button::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 0;
    border-radius: 15px;
    background-color: #212121;
    z-index: -1;
    -webkit-box-shadow: 4px 8px 19px -3px rgba(0,0,0,0.27);
    box-shadow: 4px 8px 19px -3px rgba(0,0,0,0.27);
    transition: all 250ms;
  }

  .button:hover {
    color: #e8e8e8;
  }

  .button:hover::before {
    width: 100%;
  }

  .button:active {
    transform: scale(0.98);
  }

  /* Emergency CTA Button Styles */
  .button.emergency-cta {
    background: linear-gradient(135deg, #ef4444, #dc2626) !important;
    color: #ffffff !important;
    border: 2px solid #ef4444 !important;
    box-shadow: 0 8px 25px -3px rgba(239,68,68,0.4), 0 4px 12px -2px rgba(239,68,68,0.2) !important;
    font-weight: 700 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.05em !important;
    transition: all 300ms ease !important;
  }

  .button.emergency-cta::before {
    background: linear-gradient(135deg, #dc2626, #b91c1c) !important;
    box-shadow: 0 8px 25px -3px rgba(220,38,38,0.6), 0 4px 12px -2px rgba(220,38,38,0.4) !important;
  }

  .button.emergency-cta:hover {
    color: #ffffff !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 12px 35px -3px rgba(239,68,68,0.6), 0 8px 20px -2px rgba(239,68,68,0.4) !important;
  }

  .button.emergency-cta:hover::before {
    width: 100% !important;
  }

  .button.emergency-cta:active {
    transform: translateY(0) scale(0.98) !important;
  }
`;

export default Button;