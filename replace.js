const fs = require('fs');
let code = fs.readFileSync('src/routes/CollectionRoute.tsx', 'utf8');

const startStr = "{garments.map((garment, index) => (";
const endStr = "      </div>\\n    </>\\n  );\\n}";

const startIndex = code.indexOf(startStr);
const endIndex = code.indexOf("      </div>\\r\\n    </>\\r\\n  );\\r\\n}") !== -1 
  ? code.indexOf("      </div>\\r\\n    </>\\r\\n  );\\r\\n}") 
  : code.indexOf("      </div>\\n    </>\\n  );\\n}");

if (startIndex !== -1 && endIndex !== -1) {
  const newContent = \`{garments.map((garment, index) => (
          <div
            key={index}
            style={{
              width: '85vw',
              backgroundColor: '#fdfdfd',
              padding: 'clamp(40px, 6vw, 80px)', // Deep padding for luxury feel
              boxShadow: '0 40px 100px rgba(0,0,0,0.5), 0 10px 30px rgba(0,0,0,0.3)',
              border: '1px solid #fff',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              outline: '1px solid rgba(0,0,0,0.08)',
              outlineOffset: '-20px', // Creates a sharp inner border effect
            }}
          >
            {/* Editorial Metadata Header (Placed on top of the image layout) */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '25px',
              marginBottom: '60px', // Space before the image starts
              zIndex: 10,
              position: 'relative'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                borderBottom: '2px solid #111',
                paddingBottom: '20px',
              }}>
                <h2 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2.5rem, 5.5vw, 6rem)',
                  color: '#111',
                  margin: 0,
                  lineHeight: '0.85', // Tight line height for massive editorial text
                  textTransform: 'uppercase',
                  letterSpacing: '-0.02em',
                  textShadow: '4px 4px 15px rgba(0,0,0,0.15)' // Prominent shadow effect
                }}>
                  {garment.name}
                </h2>
                <span style={{ 
                  fontFamily: 'var(--font-sans)', 
                  fontSize: 'clamp(1rem, 2vw, 1.5rem)', 
                  letterSpacing: '0.3em',
                  color: '#111',
                  fontWeight: 'bold',
                  paddingBottom: '5px'
                }}>
                  LOOK {(index + 1).toString().padStart(2, '0')}
                </span>
              </div>
              
              <div style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(1.1rem, 1.8vw, 1.3rem)',
                lineHeight: '1.7',
                color: '#333',
                maxWidth: '85%',
                fontWeight: '500', // Bolder description text
                textShadow: '1px 1px 3px rgba(0,0,0,0.1)', // Prominent effect
                borderLeft: '4px solid #111',
                paddingLeft: '25px',
                fontStyle: 'italic'
              }}>
                {garment.description}
              </div>
            </div>

            {/* Images */}
            {garment.images.map((src, imgIdx) => (
              <img 
                key={imgIdx}
                src={src}
                alt={\`\${garment.name} - View \${imgIdx + 1}\`}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.3))', // Softer but large shadow for the white bg
                  marginBottom: imgIdx !== garment.images.length - 1 ? '60px' : '0',
                  position: 'relative',
                  zIndex: 1
                }}
              />
            ))}
          </div>
        ))}\n\`;
  code = code.substring(0, startIndex) + newContent + code.substring(endIndex);
  fs.writeFileSync('src/routes/CollectionRoute.tsx', code);
  console.log("Successfully replaced");
} else {
  console.log("Could not find boundaries", startIndex, endIndex);
}
