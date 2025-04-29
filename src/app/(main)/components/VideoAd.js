import React from "react";

const VideoAd = () => (
    <div className="video-responsive">
        <iframe
            width="335"
            height="200"
            src="https://www.youtube.com/embed/om_JgFwD8mc"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded youtube"
        />
        <p className="flex items-center justify-center w-[335px] bg-[#6142ec] py-2 text-[13px] font-fira text-white">Advertisement</p>
    </div>
);


export default VideoAd;