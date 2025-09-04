import Script from 'next/script'

const AdBanner = () => {
    return (
        <div className="ad-container">
            {/* النص البرمجي المضمن */}
            <Script
                id="ad-script-config"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            atOptions = {
              'key' : '1cf1dc6c544a07ec552c828cfb0c32cd',
              'format' : 'iframe',
              'height' : 60,
              'width' : 468,
              'params' : {}
            };
          `,
                }}
            />

            {/* النص البرمجي الخارجي */}
            <Script
                id="ad-script-external"
                strategy="afterInteractive"
                src="//www.highperformanceformat.com/1cf1dc6c544a07ec552c828cfb0c32cd/invoke.js"
            />
        </div>
    )
}

export default AdBanner