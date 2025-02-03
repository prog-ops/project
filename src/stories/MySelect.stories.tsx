import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import MySelect from "../components/MySelect.tsx";
import {options} from "../App.tsx";

const meta = {
    title: 'Components/MySelect',
    component: MySelect,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'A customizable searchable dropdown component with multi-select support and chip display',
            },
        },
    },
    tags: ['autodocs'], // Automate docs generation of stories
    argTypes: {
        zIndex: {
            control: { type: 'number', min: 1, max: 9999 },
            description: 'Z-index for dropdown menu',
        },
        searchable: {
            control: 'boolean',
            description: 'Enable/disable search functionality',
        },
    },
    args: {
        onSelect: fn(),
        options: options,
    },
} satisfies Meta<typeof MySelect>;

export default meta;

type Story = StoryObj<typeof meta>;
