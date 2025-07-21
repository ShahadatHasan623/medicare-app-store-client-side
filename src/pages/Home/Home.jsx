import React from 'react';
import BannerSlider from './BannerSlider/BannerSlider';
import Categories from '../Categories/Categories';
import DiscountProducts from './DiscountProducts/DiscountProducts';
import CustomerSay from './CustomerSay/CustomerSay';
import HealthTips from './HealthTips/HealthTips';
import { ReTitle } from 're-title';

const Home = () => {
    return (
        
        <div>
            <ReTitle title='Home'></ReTitle>
            <BannerSlider></BannerSlider>
            <Categories></Categories>
            <DiscountProducts></DiscountProducts>
            <HealthTips></HealthTips>
            <CustomerSay></CustomerSay>
        </div>
    );
};

export default Home;