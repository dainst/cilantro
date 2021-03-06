/**
 * @author Daniel de Oliveira
 */

// This method implements an async variant to javascripts native Array.prototype.map() method.
// eslint-disable-next-line import/prefer-default-export
export function asyncMap<A, B>(
    inputValues: Array<A>,
    mappingFunction: (_: A) => Promise<B>
): Promise<Array<B>> {
    return Promise.all(inputValues.map(value => mappingFunction(value)));
}
