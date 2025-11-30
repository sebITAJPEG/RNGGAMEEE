import React from 'react';
import { DarkMatterView } from '../htmlviews/DarkMatterView';

interface Props {
    skipCutscene?: boolean;
}

export const DarkMatterHTMLView: React.FC<Props> = ({ skipCutscene = false }) => {
    return <DarkMatterView startSkipped={skipCutscene} />;
};
