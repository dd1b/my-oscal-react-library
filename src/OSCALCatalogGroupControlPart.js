import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import OSCALCatalogGroupControlGuidance from './OSCALCatalogGroupControlGuidance.js';

const useStyles = makeStyles((theme) => ({
	  OSCALCatalogGroupControlPart: {
		  'padding-left': '2em'
	  },
	  OSCALCatalogGroupControlStatement: {
		  'padding-left': '0em'
	  }
	}));

// TODO - This is probably 800-53 specific?
function getPartLabel(props) {
	if (!props) {return;}
	var property;
	for (property of props) {
		if (property.name === 'label') {
			return property.value;
		}
	}
}

// TODO - This is probably 800-53 specific?
function getParameterReplacedProse(prose, parameters) {
	if (!prose) {return;}
	function getParameter(match) {
		if (!parameters) {return;}
		var parameter;
		for (parameter of parameters) {
			var trimmedMatch = match.substring(3, match.length-3);
			if (parameter.id === trimmedMatch) {
				// TODO parse select parameters
				return '< ' + parameter.label + ' >';
			}
		}
	}
	return prose.replace(/\{\{ (.*) \}\}/, getParameter);
}

export default function OSCALCatalogGroupControlPart(props) {
	const classes = useStyles();
	
	const label = getPartLabel(props.part.props);
	const replacedProse = getParameterReplacedProse(props.part.prose, props.parameters);
	const isGuidance = props.part.name === 'guidance';
	const isStatement = props.part.name === 'statement';
	
	if (isGuidance) {
		return <OSCALCatalogGroupControlGuidance prose={props.part.prose} />;
	}
	if (isStatement) {
		return (
			<div className={classes.OSCALCatalogGroupControlStatement}>
				<Typography>
			    	{label} {replacedProse}
			    </Typography>
			    {props.part.parts && props.part.parts.map(part => (
			      <OSCALCatalogGroupControlPart part={part} parameters={props.parameters}/>
			    ))}
			  </div>
	    );
	}
	return (
		  <div className={classes.OSCALCatalogGroupControlPart}>
			<Typography>
	        	{label} {replacedProse}
	        </Typography>
	        {props.part.parts && props.part.parts.map(part => (
	          <OSCALCatalogGroupControlPart part={part} parameters={props.parameters}/>
            ))}
	      </div>
	  );
	
}