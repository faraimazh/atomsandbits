import React from 'react';

import { NavigationBar } from '/both/imports/components/NavigationBar'; 
import { Footer } from '/both/imports/components/Footer';
import { RootStyle, ContainerStyle, SmallSectionStyle, SpotlightCircle } from '/both/imports/styles';

const PrivacyPolicy = () => (
  <RootStyle>
    <ContainerStyle>
      <NavigationBar />
      <SmallSectionStyle backgroundColor="white" textColor="black">
        <div style={{margin: "0 auto", width: "66%"}}>
          <h2 style={{color: "black", fontSize: "2rem"}}>privacy policy</h2>
          <h1 style={{fontSize: "2.5rem"}}>under construction</h1>
        </div>
      </SmallSectionStyle>
      <Footer />
    </ContainerStyle>
  </RootStyle>
)

export default PrivacyPolicy;