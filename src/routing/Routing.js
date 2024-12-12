import { BrowserRouter as Router, Routes, Route, Navigate,useLocation } from 'react-router-dom';
import Header from '../common/Header';
import Swap from '../pages/Swap';
import Footer from '../common/Footer';
import { useState } from 'react';
import Juiced from '../pages/Juiced';
import PageNotFound from '../common/PageNotFound';
import Test from '../common/test';

function Routing() {
    const location = useLocation();
    const showFooter = location.pathname !== '/swap' && location.pathname !== '/juiced';
    const showHeader = location.pathname !== '/contact-us';

    
    return (
        <>
          {showHeader &&    <Header />}
            
            <Routes>
                <Route path="/" element={<Navigate to="/swap" />} />
                <Route path="/swap" element={<Juiced />} />
                <Route path="/test" element={<Test />} />
                <Route path="*" element={<PageNotFound />} />
                
            </Routes>

            {showFooter && <Footer />}
        </>
    );
}
export default Routing;
