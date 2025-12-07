import React, { useState } from 'react';
import { InfraredIngotView } from '../htmlviews/InfraredIngotView';
import { InfraredIngotCutscene } from '../cutscenes/InfraredIngotCutscene';

interface Props {
    skipCutscene?: boolean;
}

export const InfraredIngotHTMLView: React.FC<Props> = ({ skipCutscene = false }) => {
    const [showCutscene, setShowCutscene] = useState(!skipCutscene);

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {showCutscene ? (
                <InfraredIngotCutscene onComplete={() => setShowCutscene(false)} />
            ) : (
                <InfraredIngotView />
            )}
        </div>
    );
};
