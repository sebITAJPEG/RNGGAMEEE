import React from 'react';
import { SolidLightView } from '../htmlviews/SolidLightView';

interface Props {
    skipCutscene?: boolean;
}

export const SolidLightHTMLView: React.FC<Props> = ({ skipCutscene }) => {
    return <SolidLightView />;
};
