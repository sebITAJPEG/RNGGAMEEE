import React, { useState } from 'react';
import { SingularityCutscene } from '../cutscenes/SingularityCutscene';
import { SingularityView } from '../htmlviews/SingularityView';

interface Props {
    skipCutscene?: boolean;
}

export const SingularityCrystalHTMLView: React.FC<Props> = ({ skipCutscene = false }) => {
    const [showCutscene, setShowCutscene] = useState(!skipCutscene);

    const handleCutsceneComplete = () => {
        setShowCutscene(false);
    };

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {showCutscene ? (
                <SingularityCutscene onComplete={handleCutsceneComplete} />
            ) : (
                <SingularityView />
            )}
        </div>
    );
};
