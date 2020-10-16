import { Hrtime } from './hrtime';

export interface LatencyRefer {
    /**
     * Name to identify the execution
     */
    method: string;
    /**
     * Value of package name
     */
    packageName: string;
    /**
     * Return the duration of the method
     */
    time: Hrtime;
    /**
     * hash based of the stack value
     */
    hash?: string;
    /**
     * Trace of which functions.
     */
    stack?: string;
    /**
     * Returns the number of milliseconds from midnight, January 1, 1970 Universal Coordinated Time (UTC).
     * Use `Date.now()`
     */
    timestamp?: number;
}
