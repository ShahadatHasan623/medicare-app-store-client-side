import React from 'react';
import BannerSlider from './BannerSlider/BannerSlider';
import Categories from '../Categories/Categories';
import DiscountProducts from './DiscountProducts/DiscountProducts';
import CustomerSay from './CustomerSay/CustomerSay';
import HealthTips from './HealthTips/HealthTips';
import Promotions from './Promotions/Promotions';

const Home = () => {
    return (
        
        <div>
            <BannerSlider></BannerSlider>
            <Categories></Categories>
            <DiscountProducts></DiscountProducts>
            <Promotions></Promotions>
            <HealthTips></HealthTips>
            <CustomerSay></CustomerSay>
        </div>
    );
};

export default Home;