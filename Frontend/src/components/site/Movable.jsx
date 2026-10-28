import useMovable from '../../hooks/useMovable';

// Renders one decorative element (an eyebrow's red tick, a card number, a
// colored circle, the page hero's red banner...) as itself - no wrapper -
// and makes it selectable + draggable in edit mode via useMovable/
// MoveHandle. `id` follows the usual <page>.<section>.<field> convention so
// the backend can auto-create its block in the right section on first move.
export default function Movable(props) {
  const { id, as: Tag = 'span', className, style, children, ...rest } = props;
  const move = useMovable(id);
  const mergedClassName = [className, move.className].filter(Boolean).join(' ') || undefined;

  return (
    <Tag {...rest} {...move.props} className={mergedClassName} style={{ ...style, ...move.style }}>
      {children}
    </Tag>
  );
}
