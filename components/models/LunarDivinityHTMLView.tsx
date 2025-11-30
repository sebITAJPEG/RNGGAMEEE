import React, { useState } from 'react';
import { LunarDivinityCutscene } from '../cutscenes/LunarDivinityCutscene';
import { LunarDivinityView } from '../htmlviews/LunarDivinityView';

interface Props {
    skipCutscene?: boolean;
}

export const LunarDivinityHTMLView: React.FC<Props> = ({ skipCutscene = false }) => {
    const [showCutscene, setShowCutscene] = useState(!skipCutscene);

    const handleCutsceneComplete = () => {
        setShowCutscene(false);
    };

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {showCutscene ? (
                <LunarDivinityCutscene onComplete={handleCutsceneComplete} />
            ) : (
                <LunarDivinityView />
            )}
        </div>
    );
};
