import React, { useEffect } from 'react';
import { Modal, Button } from 'antd';
import { CheckCircleTwoTone } from '@ant-design/icons';

const SuccessPopup = ({ visible, onClose, message }) => {
  const injectMetaPixel = () => {
    // Inject main Meta Pixel script
    const initScript = document.createElement('script');
    initScript.className = 'pixelscript';
    initScript.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '739761361304719');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(initScript);

    // Inject event script (CompleteRegistration)
    const eventScript = document.createElement('script');
    eventScript.className = 'pixelscript';
    eventScript.innerHTML = `
      fbq('track', 'CompleteRegistration', {
        value: 5,
        currency: 'INR'
      });
    `;
    document.head.appendChild(eventScript);

    // Inject noscript fallback
    const noscript = document.createElement('noscript');
    noscript.className = 'pixelscript';
    noscript.innerHTML = `
      <img height="1" width="1" style="display:none"
        src="https://www.facebook.com/tr?id=739761361304719&ev=PageView&noscript=1"
      />
    `;
    document.head.appendChild(noscript);
  };

  const removeMetaPixel = () => {
    const pixelElements = document.querySelectorAll('.pixelscript');
    pixelElements.forEach((el) => el.remove());
    delete window.fbq;
    delete window._fbq;
  };

  const handleClose = () => {
    onClose();
    removeMetaPixel();
  };

  useEffect(() => {
    if (visible) {
      injectMetaPixel();
    } else {
      removeMetaPixel();
    }
    return () => {
      removeMetaPixel();
    };
  }, [visible]);

  return (
    <Modal
      open={visible}
      onCancel={handleClose}
      footer={null}
      centered
      closable={false}
    >
      <div className="text-center py-6">
        <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: '3rem' }} />
        <h2 className="text-2xl font-semibold mt-4">{message ? message : "Applied Successfully!"}</h2>
        {!message &&
        <p className="text-gray-600 mt-2">
          Your Application Submitted Successfully, Please wait for a call from our Team.
        </p>
        }
        <Button type="primary" onClick={handleClose} className="mt-6">
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default SuccessPopup;
