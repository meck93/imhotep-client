import {Ship} from './ship';
import {Stone} from './stone';

export const MOCKSHIPS: Ship[] = [
    {
        id: 1,
        gameId: 1,
        hasSailed: false,
        targetSite: '',
        min_STONE: 3,
        max_STONES: 4,
        stones:Stone[5] = [
            {
                id: 1,
                color:'BLACK'
            },
            {
                id: 2,
                color:'WHITE'
            },
            {
                id: 3,
                color:''
            },
            {
                id: 4,
                color:'BLACK'
            },
            {
                id: 5,
                color:''
            },
        ]
    },
    {
        id: 2,
        gameId: 1,
        hasSailed: false,
        targetSite: '',
        min_STONE: 2,
        max_STONES: 4,
        stones:Stone[5] = [
            {
                id: 1,
                color:''
            },
            {
                id: 2,
                color:''
            },
            {
                id: 3,
                color:''
            },
            {
                id: 4,
                color:'BROWN'
            },
        ]
    },
    {
        id: 3,
        gameId: 1,
        hasSailed: false,
        targetSite: '',
        min_STONE: 1,
        max_STONES: 3,
        stones:Stone[5] = [
            {
                id: 1,
                color:'BROWN'
            },
            {
                id: 2,
                color:'GRAY'
            },
            {
                id: 3,
                color:''
            },
        ]
    },
    {
        id: 4,
        gameId: 1,
        hasSailed: false,
        targetSite: '',
        min_STONE: 1,
        max_STONES: 1,
        stones:Stone[5] = [
            {
                id: 1,
                color:''
            }
        ]
    },
];