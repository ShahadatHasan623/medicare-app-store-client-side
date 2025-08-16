import React from 'react';
import BannerSlider from './BannerSlider/BannerSlider';
import Categories from '../Categories/Categories';
import DiscountProducts from './DiscountProducts/DiscountProducts';
import CustomerSay from './CustomerSay/CustomerSay';
import HealthTips from './HealthTips/HealthTips';
import Promotions from './Promotions/Promotions';
import BrandTrustSection from './BrandTrustSection/BrandTrustSection';
import NewsletterSection from './NewsletterSection/NewsletterSection';
import CookieConsent from './CookieConsent/CookieConsent';

const Home = () => {
    return (
        
        <div>
            <BannerSlider></BannerSlider>
            <Categories></Categories>
            <DiscountProducts></DiscountProducts>
            <Promotions></Promotions>
            <BrandTrustSection></BrandTrustSection>
            <HealthTips></HealthTips>
            <CustomerSay></CustomerSay>
            <NewsletterSection></NewsletterSection>
            <CookieConsent></CookieConsent>
        </div>
    );
};

export default Home;