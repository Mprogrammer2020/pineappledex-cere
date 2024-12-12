import { useState } from "react";
import loaderImage from "../assets/images/lazy.gif"

const ImageLoader = ({ imageSrc, alt, className = "" }) => {
    const [loading, setLoading] = useState(true);

    const handleImageLoad = () => {
        setLoading(false);
    };


    return (<>
        {loading && <img className={className} src={loaderImage} alt={alt} />}
        <img className={className}
            src={imageSrc}
            alt={alt}
            onLoad={handleImageLoad}
            style={{ display: loading ? 'none' : 'block', }}
        />
    </>)

}

export default ImageLoader;
