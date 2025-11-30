import React, { useState } from 'react';
import { SoundShardCutscene } from '../cutscenes/SoundShardCutscene';
import { SoundShardView } from '../htmlviews/SoundShardView';

interface Props {
    skipCutscene?: boolean;
}

export const SoundShardHTMLView: React.FC<Props> = ({ skipCutscene = false }) => {
    const [showCutscene, setShowCutscene] = useState(!skipCutscene);

    const handleCutsceneComplete = () => {
        setShowCutscene(false);
    };

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {showCutscene ? (
                <SoundShardCutscene onComplete={handleCutsceneComplete} />
            ) : (
                <SoundShardView />
            )}
        </div>
    );
};
