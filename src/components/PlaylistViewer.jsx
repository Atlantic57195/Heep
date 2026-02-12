import React from 'react';

const PlaylistViewer = ({
    videos,
    selectedIds,
    onToggle,
    selectAll,
    unselectAll,
    format,
    setFormat,
    onDownload,
    onCancel,
    onPause,
    isDownloading,
    isPaused,
    isChecking,
    activeDownloads = {},
    completedVideoIds = new Set(),
    totalToDownload = 0,
    onClearCompleted,
    onClearStatus,
    lastOutcome,
    onSelectDownloadDir,
    downloadDir
}) => {
    const selectedCount = selectedIds.size;
    const videoSectionRef = React.useRef(null);
    const scrollbarSectionRef = React.useRef(null);
    const contentRef = React.useRef(null);
    const scrollbarContentRef = React.useRef(null);
    const isScrolling = React.useRef(false);

    const handleSelectAll = () => {
        if (isDownloading || isPaused) return;
        onClearStatus?.();
        if (onClearCompleted) onClearCompleted();
        selectAll();
    };

    const handleUnselectAll = () => {
        if (isDownloading || isPaused) return;
        onClearStatus?.();
        if (onClearCompleted) onClearCompleted();
        unselectAll();
    };

    const handleFormatToggle = () => {
        if (isDownloading || isPaused) return;
        onClearStatus?.();
        if (onClearCompleted) onClearCompleted();
        setFormat(prev => prev === 'mp3' ? 'mp4' : 'mp3');
    };

    // Update scrollbar content height to match video content height
    React.useEffect(() => {
        const updateScrollHeight = () => {
            if (contentRef.current && scrollbarContentRef.current && videoSectionRef.current && scrollbarSectionRef.current) {
                const contentHeight = contentRef.current.scrollHeight;
                scrollbarContentRef.current.style.height = `${contentHeight}px`;
                if (videoSectionRef.current.scrollTop !== scrollbarSectionRef.current.scrollTop) {
                    scrollbarSectionRef.current.scrollTop = videoSectionRef.current.scrollTop;
                }
            }
        };

        const timeout1 = setTimeout(updateScrollHeight, 0);
        const timeout2 = setTimeout(updateScrollHeight, 100);

        let resizeObserver = null;
        if (contentRef.current && 'ResizeObserver' in window) {
            resizeObserver = new ResizeObserver(() => {
                updateScrollHeight();
            });
            resizeObserver.observe(contentRef.current);
        }
        window.addEventListener('resize', updateScrollHeight);

        return () => {
            clearTimeout(timeout1);
            clearTimeout(timeout2);
            window.removeEventListener('resize', updateScrollHeight);
            if (resizeObserver && contentRef.current) {
                resizeObserver.unobserve(contentRef.current);
            }
        };
    }, [videos]);

    const handleVideoScroll = () => {
        if (!isScrolling.current && scrollbarSectionRef.current && videoSectionRef.current) {
            isScrolling.current = true;
            scrollbarSectionRef.current.scrollTop = videoSectionRef.current.scrollTop;
            requestAnimationFrame(() => { isScrolling.current = false; });
        }
    };

    const handleScrollbarScroll = () => {
        if (!isScrolling.current && videoSectionRef.current && scrollbarSectionRef.current) {
            isScrolling.current = true;
            videoSectionRef.current.scrollTop = scrollbarSectionRef.current.scrollTop;
            requestAnimationFrame(() => { isScrolling.current = false; });
        }
    };

    if (!videos || videos.length === 0) return null;
    if (videos.length === 1) {
        const video = videos[0];
        return (
            <div className="playlist-layout-wrapper">
                <div className="playlist-header-container">
                    <div className="header-left">
                        {/* Placeholder or back button if needed, but keeping empty for now to match request for just 'like playlist header' logic sans select */}
                    </div>

                    <div className="header-center">
                        {lastOutcome === 'complete' ? (
                            <div><b>Download Completed</b></div>
                        ) : lastOutcome === 'paused' || isPaused ? (
                            <div><b>Download Paused</b></div>
                        ) : lastOutcome === 'canceled' ? (
                            <div><b>Download Canceled</b></div>
                        ) : (isDownloading || isChecking) ? (
                            <div><b>Downloading...</b></div>
                        ) : (
                            <>
                                <div><b>Video Found</b></div>
                            </>
                        )}
                    </div>

                    <div className="header-right">
                        <div className={`format-toggle ${isDownloading || isPaused ? 'disabled' : ''}`} onClick={handleFormatToggle}>
                            <div className={`toggle-pill ${format === 'mp3' ? 'left' : 'right'}`}>
                                <span className={`pill-text ${format === 'mp3' ? 'active' : ''}`}>Audio</span>
                                <span className={`pill-text ${format === 'mp4' ? 'active' : ''}`}>Video</span>
                            </div>
                            <span className={`toggle-text ${format === 'mp3' ? 'active' : ''}`}>
                                Audio
                            </span>
                            <span className={`toggle-text ${format === 'mp4' ? 'active' : ''}`}>
                                Video
                            </span>
                        </div>

                        <button
                            className={`folder-btn ${isDownloading || isPaused ? 'disabled' : ''}`}
                            onClick={() => !(isDownloading || isPaused) && onSelectDownloadDir()}
                            title={downloadDir ? `Current Folder: ${downloadDir}` : "Current Folder: n/a"}
                        >
                            <svg className="folder-icon closed-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                            </svg>
                            <svg className="folder-icon open-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>

                        {isDownloading || isPaused ? (
                            <div className="split-btn-group">
                                <button
                                    className="icon-btn cancel-btn"
                                    onClick={onCancel}
                                    title="Cancel Download"
                                    style={{ width: '100%' }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <button
                                className="download-pill-btn"
                                onClick={() => { onClearStatus?.(); onDownload(); }}
                            >
                                Download
                            </button>
                        )}
                    </div>
                </div>

                <div className="single-video-container">
                    <div className="single-video-card">
                        {/* Thumbnail */}
                        {video.thumbnail && <img src={video.thumbnail} alt="" className="single-video-thumb-large" />}

                        {/* Details */}
                        <div className="single-video-content">
                            <div className="single-video-details">
                                <span className="single-video-title-large">{video.title}</span>
                                <span className="single-video-duration-large">
                                    {video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : ''}
                                </span>

                                {/* Progress Bar for Single Video */}
                                {activeDownloads[video.id] && (
                                    <div className="single-video-progress-container">
                                        <div className="single-video-progress-bar"></div>
                                    </div>
                                )}

                                {/* Download Complete Indicator */}
                                {(lastOutcome === 'complete' || completedVideoIds.has(video.id)) && (
                                    <div className="single-video-complete-container">
                                        <div className="single-video-complete-bar">
                                            <svg className="download-complete-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } return (
        <div className="playlist-layout-wrapper">
            <div className="playlist-header-container">
                <div className="header-left">
                    <span className={`header-action ${isDownloading || isPaused ? 'disabled' : ''}`} onClick={handleSelectAll}>Select All</span>
                    <span className={`header-action ${isDownloading || isPaused ? 'disabled' : ''}`} onClick={handleUnselectAll}>Unselect all</span>
                </div>

                <div className="header-center">
                    {lastOutcome === 'complete' ? (
                        <div><b>Download Completed</b></div>
                    ) : lastOutcome === 'paused' || isPaused ? (
                        <div><b>Download Paused</b></div>
                    ) : lastOutcome === 'canceled' ? (
                        <div><b>Download Canceled</b></div>
                    ) : (isDownloading || isChecking) && totalToDownload > 0 ? (
                        <div><b>Downloading... ({Math.min(completedVideoIds.size + 1, totalToDownload)}/{totalToDownload})</b></div>
                    ) : (
                        <>
                            <div><b>{selectedCount}</b> video selected</div>
                            <div className="sub-text">{videos.length} video found</div>
                        </>
                    )}
                </div>

                <div className="header-right">
                    <div className={`format-toggle ${isDownloading || isPaused ? 'disabled' : ''}`} onClick={handleFormatToggle}>
                        <div className={`toggle-pill ${format === 'mp3' ? 'left' : 'right'}`}>
                            <span className={`pill-text ${format === 'mp3' ? 'active' : ''}`}>Audio</span>
                            <span className={`pill-text ${format === 'mp4' ? 'active' : ''}`}>Video</span>
                        </div>
                        <span className={`toggle-text ${format === 'mp3' ? 'active' : ''}`}>
                            Audio
                        </span>
                        <span className={`toggle-text ${format === 'mp4' ? 'active' : ''}`}>
                            Video
                        </span>
                    </div>

                    <button
                        className={`folder-btn ${isDownloading || isPaused ? 'disabled' : ''}`}
                        onClick={() => !(isDownloading || isPaused) && onSelectDownloadDir()}
                        title={downloadDir ? `Current Folder: ${downloadDir}` : "Current Folder: n/a"}
                    >
                        <svg className="folder-icon closed-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                        </svg>
                        <svg className="folder-icon open-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>

                    {isDownloading || isPaused ? (
                        <div className="split-btn-group">
                            <button
                                className={`icon-btn ${isPaused ? 'resume-btn' : 'pause-btn'}`}
                                onClick={isPaused ? () => { onClearStatus?.(); onDownload(true); } : onPause}
                                title={isPaused ? "Resume Download" : "Pause Download"}
                            >
                                {isPaused ? (
                                    // Play Icon
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                    </svg>
                                ) : (
                                    // Pause Icon
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="6" y="4" width="4" height="16"></rect>
                                        <rect x="14" y="4" width="4" height="16"></rect>
                                    </svg>
                                )}
                            </button>
                            <button
                                className="icon-btn cancel-btn"
                                onClick={onCancel} // Cancel action
                                title="Cancel Download"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <button
                            className="download-pill-btn"
                            onClick={() => { onClearStatus?.(); onDownload(); }}
                            disabled={selectedCount === 0}
                        >
                            Download
                        </button>
                    )}
                </div>
            </div>

            <div className="playlist-main-body">
                <div
                    className="playlist-video-section"
                    ref={videoSectionRef}
                    onScroll={handleVideoScroll}
                >
                    <div className="playlist-content" ref={contentRef}>
                        {videos.map((video, index) => (
                            <div
                                key={video.id}
                                className={`playlist-item ${isDownloading || isPaused ? 'disabled' : ''}`}
                                onClick={() => !(isDownloading || isPaused) && onToggle(video.id)}
                            >
                                <span className="video-index">#{index + 1}</span>
                                <label className="checkbox-container" onClick={(e) => e.stopPropagation()}>
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.has(video.id)}
                                        onChange={() => !(isDownloading || isPaused) && onToggle(video.id)}
                                        disabled={isDownloading || isPaused}
                                    />
                                    <svg viewBox="0 0 64 64" height="1em" width="1em">
                                        <rect x="0" y="0" width="65" height="65" rx="8" className="checkbox-highlight-bg" />
                                        <path d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16" pathLength="575.0541381835938" className="checkbox-path"></path>
                                    </svg>
                                </label>
                                {video.thumbnail && <img src={video.thumbnail} alt="" className="video-thumb" />}
                                <div className="video-info">
                                    <span className="video-title">{video.title}</span>
                                    <span className="video-duration">{video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : ''}</span>
                                    {activeDownloads[video.id] && (
                                        <div className="download-progress-bar-container">
                                            <div className="download-progress-bar"></div>
                                        </div>
                                    )}
                                    {completedVideoIds.has(video.id) && (
                                        <div className="download-complete-container">
                                            <div className="download-complete-bar">
                                                <svg className="download-complete-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div
                    className="playlist-scrollbar-section"
                    ref={scrollbarSectionRef}
                    onScroll={handleScrollbarScroll}
                >
                    <div ref={scrollbarContentRef} style={{ width: '1px', minHeight: '1px', borderRadius: '15px', paddingBottom: '15px' }} />
                </div>
            </div>
        </div >
    );
};

export default PlaylistViewer;