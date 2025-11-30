import React, { useState } from 'react';
import { HypercubeFragmentCutscene } from '../cutscenes/HypercubeFragmentCutscene';
import { HypercubeFragmentView } from '../htmlviews/HypercubeFragmentView';

interface Props {
    skipCutscene?: boolean;
}

export const HypercubeFragmentHTMLView: React.FC<Props> = ({ skipCutscene = false }) => {
    const [showCutscene, setShowCutscene] = useState(!skipCutscene);

    const handleCutsceneComplete = () => {
        setShowCutscene(false);
    };

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {showCutscene ? (
                <HypercubeFragmentCutscene onComplete={handleCutsceneComplete} />
            ) : (
                <HypercubeFragmentView />
            )}
        </div>
    );
};
