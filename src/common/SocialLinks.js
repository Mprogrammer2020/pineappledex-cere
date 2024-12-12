import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SocialLinks = ({ socialInfo, tokenInfoshimmer, setTokenInfoShimmer }) => {
    const socialPlatforms = [
        { name: 'bitbucket', imgSrc: require("../assets/images/bitbucket.svg").default, alt: 'bitbucket' },
        { name: 'discord', imgSrc: require("../assets/images/yellow-discord.svg").default, alt: 'discord' },
        { name: 'email', imgSrc: require("../assets/images/yellow-email.svg").default, alt: 'email' },
        { name: 'facebook', imgSrc: require("../assets/images/yellow-facebook.svg").default, alt: 'facebook' },
        { name: 'github', imgSrc: require("../assets/images/yellow-github.svg").default, alt: 'github' },
        { name: 'instagram', imgSrc: require("../assets/images/yellow-instagram.svg").default, alt: 'instagram' },
        { name: 'linkedin', imgSrc: require("../assets/images/yellow-linkdin.svg").default, alt: 'linkedin' },
        { name: 'medium', imgSrc: require("../assets/images/yellow-medium.svg").default, alt: 'medium' },
        { name: 'reddit', imgSrc: require("../assets/images/yellow-reddit.svg").default, alt: 'reddit' },
        { name: 'telegram', imgSrc: require("../assets/images/yellow-telegram.svg").default, alt: 'telegram' },
        { name: 'tiktok', imgSrc: require("../assets/images/yellow-titok.svg").default, alt: 'tiktok' },
        { name: 'twitter', imgSrc: require("../assets/images/yellow-x.svg").default, alt: 'twitter' },
        { name: 'website', imgSrc: require("../assets/images/yellow-website.svg").default, alt: 'website' },
        { name: 'youtube', imgSrc: require("../assets/images/yellow-youtube.svg").default, alt: 'youtube' }
    ];

    if (tokenInfoshimmer) {
        return (
            <div>
                {[0,1,2,3,4,5,6,7].map(platform => (
                    <div key={platform.name} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <Skeleton circle={true} height={20} width={20} />
                        <Skeleton height={20} width={100} style={{ marginLeft: '10px' }} />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div>
            {socialPlatforms.map(platform => (
                socialInfo?.[platform.name] ? (
                    <a
                        key={platform.name}
                        href={platform.name === 'email' ? `mailto:${socialInfo[platform.name]}` : socialInfo[platform.name]}
                        target={platform.name === 'email' ? '_self' : '_blank'}
                        rel="noopener noreferrer"
                        style={{ display: 'flex', alignItems: 'center', marginBottom: '0' }}
                    >
                        <img src={platform.imgSrc} alt={platform.alt} style={{ width: '20px', height: '20px' }} />
                        <p style={{ marginLeft: '4px' }}>{platform.alt}</p>
                    </a>
                ) : null
            ))}
        </div>
    );
};

export default SocialLinks;
