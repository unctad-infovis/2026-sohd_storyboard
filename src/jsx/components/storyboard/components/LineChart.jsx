import * as d3 from 'd3';
import { useCallback, useEffect, useRef } from 'react';

d3.formatDefaultLocale({
  decimal: '.',
  grouping: [3],
  thousands: ' '
});

const LineChart = ({ data = [], isVisible = false, annotationDate = null, annotationLabel = '', domain, yTicks = null, xTicks = null, yLabel = '', animDuration = 2000, margin = { top: 24, right: 32, bottom: 40, left: 56 } }) => {
  const svgRef = useRef(null);
  const hasDrawn = useRef(false);
  const isAnimating = useRef(false); // guard: block resize redraws during animation

  const draw = useCallback(
    animate => {
      if (!svgRef.current || !data.length) return;

      const container = svgRef.current.parentElement;
      const totalWidth = container.clientWidth;
      const totalHeight = container.clientHeight;
      const width = totalWidth - margin.left - margin.right;
      const height = totalHeight - margin.top - margin.bottom;

      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove();
      svg.attr('width', totalWidth).attr('height', totalHeight);

      const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

      // ── Scales ──────────────────────────────────────────────────────────────
      const xExtent = d3.extent(data, d => d.date);
      const xScale = d3.scaleTime().domain(xExtent).range([0, width]);

      const yScale = d3.scaleLinear().domain(domain).range([height, 0]);

      // ── Axes ────────────────────────────────────────────────────────────────
      const xAxisTicks = xTicks
        ? Array.isArray(xTicks)
          ? xTicks
          : typeof xTicks === 'function'
            ? xTicks
            : xScale.ticks(xTicks)
        : (() => {
            const years = d3.timeYears(xExtent[0], xExtent[1]);
            const lastYear = d3.timeYear.floor(xExtent[1]);
            if (!years.find(y => +y === +lastYear)) years.push(lastYear);
            return years;
          })();

      const xAxis = d3.axisBottom(xScale).tickValues(xAxisTicks).tickFormat(d3.timeFormat('%Y')).tickSize(0).tickPadding(12);

      g.append('g')
        .attr('class', 'axis axis_x')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis)
        .call(ax => ax.select('.domain').remove());

      const yAxis = d3
        .axisLeft(yScale)
        .tickValues(yTicks || yScale.ticks(5))
        .tickSize(-width)
        .tickPadding(10);

      g.append('g')
        .attr('class', 'axis axis_y')
        .call(yAxis)
        .call(ax => ax.select('.domain').remove());

      if (yLabel) {
        g.append('text')
          .attr('class', 'axis_label')
          .attr('transform', 'rotate(-90)')
          .attr('x', -height / 2)
          .attr('y', -margin.left + 14)
          .attr('text-anchor', 'middle')
          .text(yLabel);
      }

      // ── Gradient def ────────────────────────────────────────────────────────
      const gradientId = `line-gradient-${Math.random().toString(36).slice(2, 7)}`;
      const clipId = `line-clip-${Math.random().toString(36).slice(2, 7)}`;
      const defs = svg.append('defs');
      const gradient = defs.append('linearGradient').attr('id', gradientId).attr('x1', '0').attr('x2', '0').attr('y1', '0').attr('y2', '1');

      gradient.append('stop').attr('offset', '0%').attr('class', 'gradient-stop-top');
      gradient.append('stop').attr('offset', '100%').attr('class', 'gradient-stop-bottom');

      // Clip rect — starts at 0 width when animating, grows to full width with the line
      const clipRect = defs
        .append('clipPath')
        .attr('id', clipId)
        .append('rect')
        .attr('x', 0)
        .attr('y', -margin.top)
        .attr('width', animate ? 0 : width)
        .attr('height', height + margin.top);

      // ── Area fill (drawn before line so line renders on top) ─────────────────
      const areaGen = d3
        .area()
        .x(d => xScale(d.date))
        .y0(height)
        .y1(d => yScale(d.value))
        .curve(d3.curveMonotoneX);

      g.append('path').datum(data).attr('class', 'chart-area').attr('fill', `url(#${gradientId})`).attr('clip-path', `url(#${clipId})`).attr('d', areaGen);

      // ── Line ────────────────────────────────────────────────────────────────
      const lineGen = d3
        .line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.value))
        .curve(d3.curveMonotoneX);

      const path = g.append('path').datum(data).attr('class', 'chart_line').attr('fill', 'none').attr('d', lineGen);

      // ── Annotation ──────────────────────────────────────────────────────────
      let annotationGroup = null;
      if (annotationDate) {
        const ax = xScale(annotationDate);
        annotationGroup = g
          .append('g')
          .attr('class', 'annotation')
          .attr('opacity', animate ? 0 : 1);

        annotationGroup.append('line').attr('class', 'annotation_line').attr('x1', ax).attr('x2', ax).attr('y1', 0).attr('y2', height).attr('stroke-dasharray', '4 4');

        annotationGroup
          .append('text')
          .attr('class', 'annotation_label')
          .attr('x', ax - 8)
          .attr('y', 8)
          .attr('text-anchor', 'end')
          .text(annotationLabel);
      }

      // ── Animate or draw instantly ────────────────────────────────────────────
      if (animate) {
        const totalLength = path.node().getTotalLength();
        path.attr('stroke-dasharray', `${totalLength} ${totalLength}`).attr('stroke-dashoffset', totalLength);

        const annotationProgress = annotationDate ? (xScale(annotationDate) - xScale(xExtent[0])) / (xScale(xExtent[1]) - xScale(xExtent[0])) : null;

        let annotationShown = false;
        isAnimating.current = true;

        // Track the line front's x-coordinate exactly rather than linear x-interpolation,
        // because path length includes vertical segments which makes linear x lag behind.
        const pathNode = path.node();
        clipRect
          .transition()
          .duration(animDuration)
          .ease(d3.easeLinear)
          .attrTween('width', () => t => pathNode.getPointAtLength(t * totalLength).x);

        path
          .transition()
          .duration(animDuration)
          .ease(d3.easeLinear)
          .attrTween('stroke-dashoffset', () => t => {
            if (annotationGroup && !annotationShown && annotationProgress !== null && t >= annotationProgress) {
              annotationShown = true;
              annotationGroup.transition().duration(300).ease(d3.easeQuadOut).attr('opacity', 1);
            }
            return totalLength * (1 - t);
          })
          .on('end', () => {
            isAnimating.current = false;
          });
      }
    },
    [animDuration, annotationDate, annotationLabel, data, domain, margin, xTicks, yLabel, yTicks]
  );

  // Initial draw — animated
  useEffect(() => {
    if (!isVisible || hasDrawn.current || !data.length) return;
    hasDrawn.current = true;
    draw(true);
  }, [data.length, draw, isVisible]);

  // Resize — redraw without animation, but not while animating
  useEffect(() => {
    if (!hasDrawn.current) return;

    let timeout;
    const observer = new ResizeObserver(() => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (!isAnimating.current) draw(false);
      }, 100);
    });

    if (svgRef.current?.parentElement) {
      observer.observe(svgRef.current.parentElement);
    }

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [draw]);

  return <svg ref={svgRef} className="svg_container" />;
};

export default LineChart;
