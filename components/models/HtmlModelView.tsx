import React, { useMemo } from 'react';

interface Props {
    html: string;
}

export const HtmlModelView: React.FC<Props> = ({ html }) => {
    const blobUrl = useMemo(() => {
        const blob = new Blob([html], { type: 'text/html' });
        return URL.createObjectURL(blob);
    }, [html]);

    return (
        <iframe
            src={blobUrl}
            style={{
                width: '100%',
                height: '100%',
                border: 'none',
                backgroundColor: 'black',
                borderRadius: '0.75rem' // Matches rounded-xl
            }}
            title="HTML Model View"
        />
    );
};