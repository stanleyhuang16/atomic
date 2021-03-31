import React, { useContext } from 'react';
import { Group } from '@visx/group';
import { hierarchy, Tree } from '@visx/hierarchy';
import { LinearGradient } from '@visx/gradient';
import { pointRadial } from 'd3-shape';
import getLinkComponent from '../ComponentGraph/getLinkComponent';
import { Zoom } from '@visx/zoom';
import { snapshot } from '../../../types';
import { snapshotHistoryContext, snapshotIndexContext } from '../App';

const initialTransform = {
  scaleX: 0.9,
  scaleY: 0.9,
  translateX: 20,
  translateY: 10,
  skewX: 0,
  skewY: 0,
};

const defaultMargin = { top: 30, left: 30, right: 30, bottom: 70 };

export type LinkTypesProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  atomName?: string;
};

function AtomToDependentNetwork({
  width: totalWidth,
  height: totalHeight,
  margin = defaultMargin,
  atomName,
}: LinkTypesProps) {
  const { snapshotHistory } = useContext<any>(snapshotHistoryContext);
  const { snapshotIndex } = useContext<any>(snapshotIndexContext);
  const atomNamesArray = Object.keys(snapshotHistory[snapshotIndex]);

  function AtomToDependents(atom: string | undefined) {
    let atomDependentData: any = {};
    let object: snapshot;

    if (!atom) return;
    if (!snapshotHistory[snapshotIndex][atom]) {
      object = snapshotHistory[snapshotIndex][atomNamesArray[0]];
      atomDependentData.name = atomNamesArray[0];
    } else {
      object = snapshotHistory[snapshotIndex][atom];
      atomDependentData.name = atom;
    }

    atomDependentData.nodeDeps = [];

    object.d.map(item => {
      atomDependentData.nodeDeps.push({ name: item });
    });

    return atomDependentData;
  }

  const data = AtomToDependents(atomName);

  const layout = 'polar';
  const linkType = 'line';

  const innerWidth = totalWidth - margin.left - margin.right;
  const innerHeight = totalHeight - margin.top - margin.bottom;
  console.log({ atomName });

  let origin: { x: number; y: number };
  let sizeWidth: number;
  let sizeHeight: number;
  origin = {
    x: innerWidth / 2,
    y: innerHeight / 2,
  };
  sizeWidth = 2 * Math.PI;
  sizeHeight = Math.min(innerWidth, innerHeight) / 2;

  const LinkComponent = getLinkComponent({ layout, linkType });

  return totalWidth < 10 ? null : (
    <div>
      <Zoom
        width={totalWidth}
        height={totalHeight}
        scaleXMin={1 / 2}
        scaleXMax={4}
        scaleYMin={1 / 2}
        scaleYMax={4}
        transformMatrix={initialTransform}
      >
        {zoom => (
          <svg width={totalWidth} height={totalHeight}>
            <LinearGradient id="atom-gradient" from="#de638a" to="#d13164" />
            <LinearGradient
              id="dependent-gradient"
              from="#41b69c"
              to="#2d806d"
            />
            <rect
              width={totalWidth}
              height={totalHeight}
              rx={14}
              fill="#202020"
            />
            <g transform={zoom.toString()}>
              <Group top={margin.top} left={margin.left}>
                <Tree
                  root={hierarchy(data, d =>
                    d.isExpanded ? null : d.nodeDeps
                  )}
                  size={[sizeWidth, sizeHeight]}
                  separation={(a, b) =>
                    (a.parent === b.parent ? 0.55 : 0.5) / a.depth
                  }
                >
                  {tree => (
                    <Group top={origin.y} left={origin.x}>
                      {tree.links().map((link, i) => (
                        <LinkComponent
                          key={i}
                          data={link}
                          stroke="#7c7c7c"
                          strokeWidth="1"
                          fill="none"
                        />
                      ))}

                      {tree.descendants().map((node, key) => {
                        // const widthFunc = (name: string) => {
                        //   let nodeLength = name.length;
                        //   if (nodeLength < 5) return nodeLength + 30;
                        //   if (nodeLength < 10) return nodeLength + 45;
                        //   if (nodeLength < 20) return nodeLength + 90;
                        //   return nodeLength + 70;
                        // };
                        // const width = widthFunc(node.data.name);
                        // const height = 20;

                        let top: number;
                        let left: number;

                        const [radialX, radialY] = pointRadial(node.x, node.y);
                        top = radialY;
                        left = radialX;

                        const radiusFunc = (name: string) => {
                          let nodeLength = name.length;
                          if (nodeLength < 5) return nodeLength + 20;
                          if (nodeLength < 10) return nodeLength + 25;
                          if (nodeLength < 15) return nodeLength + 40;
                          if (nodeLength < 20) return nodeLength + 50;
                          return nodeLength + 70;
                        };
                        const radius = radiusFunc(node.data.name);

                        return (
                          <Group top={top} left={left} key={key}>
                            {node.depth === 0 && (
                              <circle fill="url('#atom-gradient')" r={radius} />
                            )}
                            {node.depth !== 0 && (
                              <circle
                                r={radius}
                                fill={"url('#dependent-gradient')"}
                              />
                            )}
                            <text
                              dy=".33em"
                              fontSize={13}
                              fontFamily="Arial"
                              textAnchor="middle"
                              style={{
                                pointerEvents: 'none',
                                fontWeight: 'bold',
                              }}
                              fill={'#e6e6e6'}
                            >
                              {node.data.name}
                            </text>
                          </Group>
                        );
                      })}
                    </Group>
                  )}
                </Tree>
              </Group>
            </g>
            <rect
              width={totalWidth}
              height={totalHeight}
              rx={14}
              fill="transparent"
              onTouchStart={zoom.dragStart}
              onTouchMove={zoom.dragMove}
              onTouchEnd={zoom.dragEnd}
              onMouseDown={zoom.dragStart}
              onMouseMove={zoom.dragMove}
              onMouseUp={zoom.dragEnd}
              onMouseLeave={() => {
                if (zoom.isDragging) zoom.dragEnd();
              }}
            />
          </svg>
        )}
      </Zoom>
    </div>
  );
}

export default AtomToDependentNetwork;