import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";
import type { Operation, Payload } from "./types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
    y?: number;
    x?: number;
    start?: number;
    duration?: number;
};

export const flyAndScale = (
    node: Element,
    params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
    const style = getComputedStyle(node);
    const transform = style.transform === "none" ? "" : style.transform;

    const scaleConversion = (
        valueA: number,
        scaleA: [number, number],
        scaleB: [number, number]
    ) => {
        const [minA, maxA] = scaleA;
        const [minB, maxB] = scaleB;

        const percentage = (valueA - minA) / (maxA - minA);
        const valueB = percentage * (maxB - minB) + minB;

        return valueB;
    };

    const styleToString = (
        style: Record<string, number | string | undefined>
    ): string => {
        return Object.keys(style).reduce((str, key) => {
            if (style[key] === undefined) return str;
            return str + `${key}:${style[key]};`;
        }, "");
    };

    return {
        duration: params.duration ?? 200,
        delay: 0,
        css: (t) => {
            const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
            const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
            const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

            return styleToString({
                transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                opacity: t
            });
        },
        easing: cubicOut
    };
};

/* MY UTILS */

const envPlaceholder = {
    start: '@@',
    end: '@'
}

/**
     * Transforms/filters the raw payload to a "readable" one.
     * @param _payload The object to transform.
     */
export function transformToJSON (_payload: Payload) {
    let payloadBuffer = structuredClone(_payload);
    Object.entries(payloadBuffer.flows).forEach(([flow_name, flow_body]) => {
        let flowBuffer = [];

        for (let operation of Object.values(flow_body)) {
            let operationBody: { command: string, enabled: boolean } = {
                command: operation.command,
                enabled: operation.enabled
            };
            
            if (operation?.input_fields) {
                Object.entries(operation.input_fields).forEach(([field_name, field]: Array<string>) => {
                    operationBody[field_name] = field.value;
                })
            }

            flowBuffer.push(operationBody);
        }

        payloadBuffer.flows[flow_name] = flowBuffer;
    });
    return JSON.stringify(payloadBuffer, null, 3);
}

export const placeholderMatchRegExp = new RegExp(`${ envPlaceholder.start }.*${ envPlaceholder.end }`, 'g');

export function snakeCaseToPascalCase (_string, _spaced = false) {
    if (_spaced) {
        return _string.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    } else {
        return _string.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('_');
    }
}

export function convertToSnakeCase (_string) {
    return _string.toLowerCase().replaceAll(/[\s-]/g, '_');
}

export function genUUID () {
    return Math.random().toString().slice(2);
}

/**
 * Checks if click was on any of the elements with the guides
 * @param {Array<string>} _guides 
 * @param {string} _target 
 * @returns 
 */
export function checkClickOnGuideIDs (_guides, _target) {
    return _guides.includes(_target.dataset.guideId);
}

export function copyToClipboard (_text) {
    window.navigator.clipboard.writeText(_text);
}