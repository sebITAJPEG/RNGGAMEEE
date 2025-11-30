import React from 'react';
import { SolarPlasmaView } from '../htmlviews/SolarPlasmaView';

interface Props {
    skipCutscene?: boolean;
}

export const SolarPlasmaHTMLView: React.FC<Props> = ({ skipCutscene }) => {
    return <SolarPlasmaView />;
};
