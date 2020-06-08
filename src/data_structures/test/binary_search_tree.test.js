import BinarySearchTree from '../binary_search_tree';
import RedBlackTree from '../red_black_tree';

// Note: RedBlackTrees also have specific tests
// in red_black_tree.test.js

const dataStructures = [
  BinarySearchTree,
  RedBlackTree,
];

dataStructures.forEach(TargetDS => {
  describe(TargetDS, () => {
    let bst;
    beforeEach(() => {
      bst = new TargetDS();
    });

    it('starts empty', () => {
      expect(bst.count()).toBe(0);
    });

    describe('lookup', () => {
      it('returns undefined on an empty tree', () => {
        expect(bst.lookup('test')).toBe(undefined);
      });

      it('returns undefined if the key is not in the tree', () => {
        const keys = ['many', 'keys', 'for', 'this', 'tree'];
        keys.forEach((key, i) => {
          bst.insert(key);
        });

        expect(bst.lookup('dne')).toBe(undefined);
      });

      it('finds the only record', () => {
        bst.insert('test');
        expect(bst.lookup('test')).toBeTruthy();
      });

      it('finds any extant record', () => {
        const keys = ['many', 'keys', 'for', 'this', 'tree'];
        keys.forEach(key => {
          bst.insert(key);
        });

        keys.forEach(key => {
          expect(bst.lookup(key)).toBeTruthy();
        });

        keys.reverse().forEach(key => {
          expect(bst.lookup(key)).toBeTruthy();
        });
      });

      it('returns the value associated with a record', () => {
        const records = [
          { key: 'one', value: 'first' },
          { key: 'two', value: 'second' },
          { key: 'three', value: 'third' },
          { key: 'four', value: 'fourth' },
          { key: 'five', value: 'fifth' },
        ];

        records.forEach(({ key, value }) => {
          bst.insert(key, value);
        });

        records.forEach(({ key, value }) => {
          expect(bst.lookup(key)).toBe(value);
        });

        records.reverse().forEach(({ key, value }) => {
          expect(bst.lookup(key)).toBe(value);
        });
      });
    });

    describe('insert', () => {
      it('increases count by 1', () => {
        expect(bst.count()).toBe(0);
        bst.insert('test');
        expect(bst.count()).toBe(1);

        const keys = ['many', 'keys', 'for', 'this', 'tree'];
        keys.forEach((key, i) => {
          bst.insert(key);
          expect(bst.count()).toBe(2 + i);
        });
      });

      it('replaces records with the same key and does not increase the count', () => {
        bst.insert('test', 'first value');
        expect(bst.count()).toBe(1);
        expect(bst.lookup('test')).toBe('first value');

        bst.insert('test', 'second value');
        expect(bst.count()).toBe(1);
        expect(bst.lookup('test')).toBe('second value');
      });

      it('uses true as the default value', () => {
        bst.insert('test');
        expect(bst.lookup('test')).toBe(true);
      });
    });

    describe('delete', () => {
      it('returns the value for the removed record', () => {
        bst.insert('test', 'first value');
        expect(bst.delete('test')).toBe('first value');
      });

      it('returns undefined if the record was not found', () => {
        expect(bst.delete('record')).toBe(undefined);
      });

      it('reduces the count by 1', () => {
        bst.insert('test', 'first value');
        expect(bst.count()).toBe(1);
        bst.delete('test');
        expect(bst.count()).toBe(0);
      });

      it('omits the removed record from iteration results', () => {
        const keys = ['keys', 'for', 'this', 'tree'];
        keys.forEach(key => bst.insert(key));

        bst.delete('for');
        const cb = jest.fn();
        bst.forEach(cb);

        expect(cb.mock.calls.length).toBe(keys.length - 1);
        expect(cb.mock.calls[0][0].key).toBe('keys');
        expect(cb.mock.calls[1][0].key).toBe('this');
        expect(cb.mock.calls[2][0].key).toBe('tree');
      });

      it('can remove every element in a tree', () => {
        const keys = ['keys', 'for', 'this', 'tree'];
        keys.forEach(key => bst.insert(key));
        expect(bst.count()).toBe(4);

        keys.forEach(key => bst.delete(key));
        expect(bst.count()).toBe(0);
      });

      describe('scenarios', () => {
        let records;
        beforeEach(() => {
          records = [
            { key: 'o', value: 'first' },
            { key: 'h', value: 'second' },
            { key: 't', value: 'third' },
            { key: 'd', value: 'fourth' },
            { key: 'k', value: 'fifth' },
            { key: 'a', value: 'sixth' },
            { key: 'r', value: 'seventh' },
            { key: 'w', value: 'eighth' },
            { key: 'v', value: 'ninth' },
            { key: 'y', value: 'tenth' },
            { key: 'z', value: 'eleventh'},
          ];

          records.forEach(({ key, value}) => {
            bst.insert(key, value);
          });
        });

        const sortRecords = (records) => {
          return records.sort((a, b) => a.key.localeCompare(b.key));
        }
        // The first step for each of these tests will be to construct
        // a tree matching the scenario. How can you use your knowledge
        // of how insert works to do this? How can you check your work?

        it('can remove the record with the smallest key', () => {
          expect(bst.count()).toBe(11);
          expect(bst.delete('a')).toBe('sixth');
          expect(bst.lookup('a')).toBe(undefined);
          expect(bst.count()).toBe(10);

          const cb = jest.fn();
          bst.forEach(cb);

          records.splice(5, 1);
          sortRecords(records).forEach(({ key, value }, i) => {
            expect(cb.mock.calls[i][0].key).toBe(key);
            expect(cb.mock.calls[i][0].value).toBe(value);
          });
        });

        it('can remove the record with the largest key', () => {
          expect(bst.delete('z')).toBe('eleventh');
          expect(bst.lookup('z')).toBe(undefined);

          const cb = jest.fn();
          bst.forEach(cb);

          records.splice(10, 1);
          sortRecords(records).forEach(({ key, value }, i) => {
            expect(cb.mock.calls[i][0].key).toBe(key);
            expect(cb.mock.calls[i][0].value).toBe(value);
          });
        });

        it('can remove the root', () => {
          expect(bst.delete('o')).toBe('first');
          expect(bst.lookup('o')).toBe(undefined);

          const cb = jest.fn();
          bst.forEach(cb);

          records.splice(0, 1);
          sortRecords(records).forEach(({ key, value }, i) => {
            expect(cb.mock.calls[i][0].key).toBe(key);
            expect(cb.mock.calls[i][0].value).toBe(value);
          });
        });

        it('can remove a node with no children', () => {
          expect(bst.delete('k')).toBe('fifth');
          expect(bst.lookup('k')).toBe(undefined);

          const cb = jest.fn();
          bst.forEach(cb);

          records.splice(4, 1);
          sortRecords(records).forEach(({ key, value }, i) => {
            expect(cb.mock.calls[i][0].key).toBe(key);
            expect(cb.mock.calls[i][0].value).toBe(value);
          });
        });

        it('can remove a node with only a left child', () => {
          expect(bst.delete('d')).toBe('fourth');
          expect(bst.lookup('d')).toBe(undefined);

          records.splice(3, 1);

          const cb = jest.fn();
          bst.forEach(cb);

          sortRecords(records).forEach(({ key, value }, i) => {
            expect(cb.mock.calls[i][0].key).toBe(key);
            expect(cb.mock.calls[i][0].value).toBe(value);
          });
        });

        it('can remove a node with only a right child', () => {
          expect(bst.delete('y')).toBe('tenth');
          expect(bst.lookup('y')).toBe(undefined);

          records.splice(9, 1);
          expect(records.length).toBe(10);

          const cb = jest.fn();
          bst.forEach(cb);

          sortRecords(records).forEach(({ key, value }, i) => {
            expect(cb.mock.calls[i][0].key).toBe(key);
            expect(cb.mock.calls[i][0].value).toBe(value);
          });
        });

        it('can remove a node with both children, where the successor is the node\'s right child', () => {
          expect(bst.delete('h')).toBe('second');
          expect(bst.lookup('h')).toBe(undefined);

          const cb = jest.fn();
          bst.forEach(cb)

          records.splice(1, 1);
          sortRecords(records).forEach(({ key, value}, i) => {
            expect(cb.mock.calls[i][0].key).toBe(key);
            expect(cb.mock.calls[i][0].value).toBe(value);
          })
        });

        it('can remove a node with both children, where the successor is not the node\'s right child', () => {
          expect(bst.delete('t')).toBe('third');
          // console.log("here", bst);
          // console.log("_root", bst._root.key);
          // console.log("R", bst._root.right.key);
          // console.log("R, L", bst._root.right.left.key);
          // console.log("R, R", bst._root.right.right.key);
          console.log("count", bst.count());

          let arr = [];
          bst.forEach(el => arr.push(el));
          console.log("***", arr);

          expect(bst.lookup('t')).toBe(undefined);

          const cb = jest.fn();
          bst.forEach(cb)

          records.splice(2, 1);
          sortRecords(records).forEach(({ key, value}, i) => {
            // console.log("iiiiii", i);
            // console.log("^^^^", key);
            expect(cb.mock.calls[i][0].key).toBe(key);
            expect(cb.mock.calls[i][0].value).toBe(value);
          })
        });
      });
    });

    describe('forEach', () => {
      let records;
      beforeEach(() => {
        records = [
          { key: 'one', value: 'first' },
          { key: 'two', value: 'second' },
          { key: 'three', value: 'third' },
          { key: 'four', value: 'fourth' },
          { key: 'five', value: 'fifth' },
        ];
      });

      const sortRecords = (records) => {
        return records.sort((a, b) => a.key.localeCompare(b.key));
      }

      const fill = (records) => {
        records.forEach(({ key, value }) => {
          bst.insert(key, value);
        });
      }

      it('runs the callback 0 times on an empty tree', () => {
        const cb = jest.fn();
        bst.forEach(cb);

        expect(cb.mock.calls.length).toBe(0);
      });

      it('provides {key, value}, index and tree as cb args', () => {
        bst.insert('key', 'value');

        const cb = jest.fn();
        bst.forEach(cb);

        const callArgs = cb.mock.calls[0];
        expect(callArgs[0].key).toBe('key');
        expect(callArgs[0].value).toBe('value');
        expect(callArgs[1]).toBe(0);
        expect(callArgs[2]).toBe(bst);
      });

      it('iterates records in key order', () => {
        fill(records);

        const cb = jest.fn();
        bst.forEach(cb);

        sortRecords(records).forEach(({ key, value }, i) => {
          const callArgs = cb.mock.calls[i];
          expect(callArgs[0].key).toBe(key);
          expect(callArgs[0].value).toBe(value);
          expect(callArgs[1]).toBe(i);
          expect(callArgs[2]).toBe(bst);
        });
      });

      it('iterates correctly for sorted input', () => {
        fill(sortRecords(records));

        const cb = jest.fn();
        bst.forEach(cb);

        sortRecords(records).forEach(({ key, value }, i) => {
          const callArgs = cb.mock.calls[i];
          expect(callArgs[0].key).toBe(key);
          expect(callArgs[0].value).toBe(value);
          expect(callArgs[1]).toBe(i);
          expect(callArgs[2]).toBe(bst);
        });
      });

      it('iterates correctly for reverse-sorted input', () => {
        fill(sortRecords(records).reverse());

        const cb = jest.fn();
        bst.forEach(cb);

        sortRecords(records).forEach(({ key, value }, i) => {
          const callArgs = cb.mock.calls[i];
          expect(callArgs[0].key).toBe(key);
          expect(callArgs[0].value).toBe(value);
          expect(callArgs[1]).toBe(i);
          expect(callArgs[2]).toBe(bst);
        });
      });
    });
  });
});
