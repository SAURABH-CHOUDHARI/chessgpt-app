declare module '@chrisoakman/react-chessboard' {
    import React from 'react';

    export interface ChessboardProps {
        position: string;
        onPieceDrop?: (sourceSquare: string, targetSquare: string, piece?: string) => boolean;
        // add other props if needed
    }

    export class Chessboard extends React.Component<ChessboardProps> { }
}
