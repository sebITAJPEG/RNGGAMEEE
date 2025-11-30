import React from 'react';
import { CrystallizedThoughtView } from '../htmlviews/CrystallizedThoughtView';

interface Props {
    skipCutscene?: boolean;
}

export const CrystallizedThoughtHTMLView: React.FC<Props> = ({ skipCutscene }) => {
    return <CrystallizedThoughtView startSkipped={skipCutscene} />;
};
